const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8899;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/preview_public_store.html';
  const filePath = path.join(__dirname, '..', reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found: ' + reqPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on ${PORT}`);
  const chromeProc = cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9229',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1200,900'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const httpGet = (url) => new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  try {
    const targets = await httpGet('http://127.0.0.1:9229/json');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const wsUrl = pageTarget.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);

    let id = 1;
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

    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/preview_public_store.html` });
    await new Promise(r => setTimeout(r, 2000));

    // Inspect computed style of all badges across the entire page
    const allBadgesRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return Array.from(document.querySelectorAll('.badge, .design-lab-badge, .vault-master-badge, .portal-tag, .studio-live-pill')).map(el => {
            const s = window.getComputedStyle(el);
            return {
              class: el.className,
              text: el.innerText.trim(),
              color: s.color,
              webkitTextFillColor: s.webkitTextFillColor,
              backgroundColor: s.backgroundColor,
              border: s.border,
              opacity: s.opacity,
              visibility: s.visibility
            };
          });
        })()
      `,
      returnByValue: true
    });
    console.log('ALL BADGES ON PAGE:');
    console.log(JSON.stringify(allBadgesRes.result.value, null, 2));

    // Scroll section header into view
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#before-after .section-header').scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot of viewport focused on the section header
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const outDir = 'C:\\Users\\sharm\\.gemini\\antigravity\\brain\\2e1975ed-a550-4daa-8eeb-09f7e34cda42';
    fs.writeFileSync(path.join(outDir, 'badge_visibility_fixed.png'), Buffer.from(ss.data, 'base64'));
    console.log('Saved screenshot to badge_visibility_fixed.png');

    // Also capture mobile viewport screenshot (390px)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `
        document.querySelector('#before-after .section-header').scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const ssMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'badge_visibility_mobile_fixed.png'), Buffer.from(ssMobile.data, 'base64'));
    console.log('Saved mobile screenshot to badge_visibility_mobile_fixed.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
