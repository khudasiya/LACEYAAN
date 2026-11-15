const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Start simple static server
const PORT = 8899;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/preview_public_store.html';
  const filePath = path.join(__dirname, '..', reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found: ' + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}`);
  runTests();
});

// 2. Launch headless Chrome with CDP
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIEWPORTS = [
  { width: 320, height: 640, label: '320px - Small mobile (iPhone SE 1st)' },
  { width: 360, height: 740, label: '360px - Standard Android' },
  { width: 375, height: 812, label: '375px - iPhone' },
  { width: 390, height: 844, label: '390px - Modern iPhone' },
  { width: 414, height: 896, label: '414px - Large mobile' },
  { width: 430, height: 932, label: '430px - Large mobile Pro Max' },
  { width: 768, height: 1024, label: '768px - Tablet' },
  { width: 1024, height: 768, label: '1024px - Small laptop' },
  { width: 1440, height: 900, label: '1440px - Desktop' }
];

async function runTests() {
  const chromeProc = cp.spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9333',
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  // wait 1s for chrome to start
  await new Promise(r => setTimeout(r, 1200));

  try {
    const versionData = await fetchJson('http://127.0.0.1:9333/json/version');
    const wsUrl = versionData.webSocketDebuggerUrl;
    console.log('Connected to CDP via WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const { resolve, reject } = callbacks.get(data.id);
        callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    // Create target page
    const { targetId } = await send('Target.createTarget', { url: `http://127.0.0.1:${PORT}/preview_public_store.html` });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, sessionId, method, params }));
      });
    }

    await sendSession('Page.enable');
    await sendSession('DOM.enable');

    console.log('\n======================================================');
    console.log('BEGINNING VIEWPORT DEVICE EMULATION & OVERFLOW CHECKS');
    console.log('======================================================\n');

    const auditResults = {};

    for (const vp of VIEWPORTS) {
      // 1. Set Device Metrics Override (True responsive emulation)
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width <= 768
      });

      // 2. Wait for layout settle
      await new Promise(r => setTimeout(r, 600));

      // 3. Evaluate exact responsive layout metrics
      const evalScript = `
        (() => {
          const docEl = document.documentElement;
          const body = document.body;
          const clientWidth = docEl.clientWidth;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const hasOverflow = scrollWidth > clientWidth + 1;
          const overflowAmount = Math.max(0, scrollWidth - clientWidth);

          // Find specific elements that cause horizontal overflow
          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && (rect.right > clientWidth + 1.5 || rect.left < -1.5)) {
              const tag = el.tagName.toLowerCase();
              const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
              const id = el.id ? '#' + el.id : '';
              overflowing.push({
                selector: tag + id + cls,
                rectRight: Math.round(rect.right),
                rectLeft: Math.round(rect.left),
                overflowRight: Math.round(rect.right - clientWidth)
              });
            }
          });

          // Check interactive touch targets
          const smallTargets = [];
          document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0) {
              if (rect.width < 44 || rect.height < 44) {
                const tag = el.tagName.toLowerCase();
                const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '';
                smallTargets.push({
                  selector: tag + cls,
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                  text: el.textContent.trim().slice(0, 20)
                });
              }
            }
          });

          return {
            clientWidth,
            scrollWidth,
            hasOverflow,
            overflowAmount,
            overflowingElementsCount: overflowing.length,
            topOverflowing: overflowing.slice(0, 8),
            smallTargetsCount: smallTargets.length,
            sampleSmallTargets: smallTargets.slice(0, 5)
          };
        })()
      `;

      const evalRes = await sendSession('Runtime.evaluate', {
        expression: evalScript,
        returnByValue: true
      });

      const data = evalRes.result.value;
      auditResults[vp.width] = data;

      const statusBadge = data.hasOverflow ? `[FAIL: OVERFLOW +${data.overflowAmount}px]` : `[PASS: ZERO OVERFLOW]`;
      console.log(`${vp.width}px (${vp.label}): ${statusBadge}`);
      console.log(`   ClientWidth: ${data.clientWidth}px | ScrollWidth: ${data.scrollWidth}px | Overflowing Nodes: ${data.overflowingElementsCount}`);
      if (data.overflowingElementsCount > 0) {
        console.log(`   Top overflowing elements:`);
        data.topOverflowing.forEach(o => {
          console.log(`     - ${o.selector}: right=${o.rectRight}px (overflow: +${o.overflowRight}px, left=${o.rectLeft}px)`);
        });
      }
      console.log(`   Touch targets < 44px: ${data.smallTargetsCount}`);
      console.log('------------------------------------------------------');
    }

    fs.writeFileSync(
      path.join(__dirname, '..', 'viewport_reports', 'cdp_viewport_audit.json'),
      JSON.stringify(auditResults, null, 2)
    );
    console.log('\nCDP audit report written to viewport_reports/cdp_viewport_audit.json');

    ws.close();
  } catch (err) {
    console.error('CDP test error:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}
