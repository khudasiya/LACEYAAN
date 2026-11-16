const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8893;
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

const PAGES = [
  { url: '/preview_public_store.html', name: 'Homepage' },
  { url: '/preview_product.html', name: 'Product Detail Page' },
  { url: '/preview_cart.html', name: 'Cart Page' },
  { url: '/preview_collection.html', name: 'Collection Catalog' }
];

const VIEWPORTS = [
  { width: 320, height: 640, label: '320px (Small Mobile)' },
  { width: 360, height: 740, label: '360px (Standard Android)' },
  { width: 375, height: 812, label: '375px (iPhone)' },
  { width: 390, height: 844, label: '390px (Modern iPhone)' },
  { width: 414, height: 896, label: '414px (Large Mobile)' },
  { width: 430, height: 932, label: '430px (Pro Max)' },
  { width: 768, height: 1024, label: '768px (Tablet)' },
  { width: 1024, height: 768, label: '1024px (Small Laptop)' },
  { width: 1440, height: 900, label: '1440px (Desktop)' }
];

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Test server running at http://127.0.0.1:${PORT}`);
  await runAllTests();
});

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runAllTests() {
  const chromeProc = cp.spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9334',
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  let versionData = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      await new Promise(r => setTimeout(r, 600));
      versionData = await fetchJson('http://127.0.0.1:9334/json/version');
      if (versionData && versionData.webSocketDebuggerUrl) break;
    } catch (e) {
      // retry
    }
  }
  if (!versionData) throw new Error('Could not connect to Chrome debugging port 9334 after 10 attempts');

  try {
    const ws = new WebSocket(versionData.webSocketDebuggerUrl);
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

    console.log('\n=============================================================');
    console.log('FULL STOREFRONT MULTI-PAGE RESPONSIVE MATRIX AUDIT');
    console.log('=============================================================\n');

    const fullMatrix = {};

    for (const page of PAGES) {
      console.log(`\n>>> AUDITING PAGE: ${page.name} (${page.url})`);
      fullMatrix[page.name] = {};

      const { targetId } = await send('Target.createTarget', { url: `http://127.0.0.1:${PORT}${page.url}` });
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
      await sendSession('Page.navigate', { url: `http://127.0.0.1:${PORT}${page.url}` });
      await new Promise(r => setTimeout(r, 1200));

      for (const vp of VIEWPORTS) {
        await sendSession('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 2,
          mobile: vp.width <= 768
        });

        await new Promise(r => setTimeout(r, 300));

        const evalRes = await sendSession('Runtime.evaluate', {
          expression: `(() => {
            const docEl = document.documentElement;
            const body = document.body || docEl;
            const clientWidth = docEl.clientWidth;
            const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
            const overflow = Math.max(0, scrollWidth - clientWidth);

            const culprits = [];
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > clientWidth + 1.5 && r.width > 0 && r.height > 0) {
                culprits.push({
                  tag: el.tagName,
                  cls: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
              }
            });

            return {
              clientWidth,
              scrollWidth,
              overflow,
              hasOverflow: overflow > 1,
              culprits: culprits.slice(0, 3)
            };
          })()`,
          returnByValue: true
        });

        if (!evalRes || !evalRes.result || !evalRes.result.value) {
          console.error('Eval error or empty result:', evalRes);
          continue;
        }

        const res = evalRes.result.value;
        fullMatrix[page.name][vp.width] = res;

        const status = res.hasOverflow ? `[FAIL: +${res.overflow}px OVERFLOW]` : `[PASS: 100% CLEAN]`;
        console.log(`  ${vp.label.padEnd(28)}: ${status} (client: ${res.clientWidth}px, scroll: ${res.scrollWidth}px)`);
        if (res.hasOverflow) {
          console.log(`     Culprits:`, res.culprits);
        }
      }

      await send('Target.closeTarget', { targetId });
    }

    fs.writeFileSync(
      path.join(__dirname, '..', 'viewport_reports', 'full_pages_responsive_matrix.json'),
      JSON.stringify(fullMatrix, null, 2)
    );
    console.log('\nAudit matrix saved to viewport_reports/full_pages_responsive_matrix.json');

    ws.close();
  } catch (err) {
    console.error('Test matrix error:', err);
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
