const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8898;
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
  if (reqPath === '/') reqPath = '/preview_collection.html';
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
  console.log(`Test server running on port ${PORT}`);
  const chromeProc = cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,960'
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
    const targets = await httpGet('http://127.0.0.1:9230/json');
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

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

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/preview_collection.html` });
    await new Promise(r => setTimeout(r, 1800));

    // Audit computed styles
    const stylesRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const controlsBar = document.querySelector('.collection-controls-bar');
          const activePill = document.querySelector('.filter-pill.active');
          const inactivePill = document.querySelectorAll('.filter-pill')[1];
          const sortSelect = document.querySelector('.sort-select');
          const sortLabel = document.querySelector('.sort-label');

          const getInfo = (el) => {
            if (!el) return null;
            const s = window.getComputedStyle(el);
            return {
              color: s.color,
              webkitTextFillColor: s.webkitTextFillColor,
              backgroundColor: s.backgroundColor,
              border: s.border,
              borderRadius: s.borderRadius,
              fontSize: s.fontSize,
              fontFamily: s.fontFamily,
              padding: s.padding,
              boxShadow: s.boxShadow
            };
          };

          return {
            activePill: getInfo(activePill),
            inactivePill: getInfo(inactivePill),
            sortSelect: getInfo(sortSelect),
            sortLabel: getInfo(sortLabel)
          };
        })()
      `,
      returnByValue: true
    });

    console.log('COMPUTED STYLES:');
    console.log(JSON.stringify(stylesRes.result.value, null, 2));

    // Scroll to collection section
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo({ top: document.querySelector('.main-collection-section').offsetTop - 60, behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 500));

    const outDir = 'C:\\Users\\sharm\\.gemini\\antigravity\\brain\\2e1975ed-a550-4daa-8eeb-09f7e34cda42';
    
    // Desktop screenshot
    const ssDesktop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'collection_controls_desktop.png'), Buffer.from(ssDesktop.data, 'base64'));
    console.log('Saved desktop screenshot to collection_controls_desktop.png');

    // Mobile screenshot
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo({ top: document.querySelector('.main-collection-section').offsetTop - 60, behavior: 'instant' });
      `
    });
    await new Promise(r => setTimeout(r, 500));

    const ssMobile = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'collection_controls_mobile.png'), Buffer.from(ssMobile.data, 'base64'));
    console.log('Saved mobile screenshot to collection_controls_mobile.png');

    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
