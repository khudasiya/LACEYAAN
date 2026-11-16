const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8895;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/preview_product.html';
  const filePath = path.join(__dirname, '..', reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', async () => {
  const chrome = cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9235',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  const httpGet = (url) => new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  try {
    const targets = await httpGet('http://127.0.0.1:9235/json');
    const p = targets.find(t => t.type === 'page') || targets[0];
    const ws = new WebSocket(p.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id && callbacks.has(d.id)) {
        const { resolve, reject } = callbacks.get(d.id);
        callbacks.delete(d.id);
        if (d.error) reject(d.error); else resolve(d.result);
      }
    };
    const send = (m, params = {}) => new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method: m, params }));
    });
    await new Promise(r => ws.onopen = r);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/preview_product.html` });
    await new Promise(r => setTimeout(r, 1500));

    // Click 2nd thumbnail in the side thumbnails strip on the right of the main photo
    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sideThumbs = document.querySelectorAll('#ProductGalleryThumbs .gallery-thumb-btn');
          if (sideThumbs.length > 1) {
            sideThumbs[1].click();
            const mainImg = document.getElementById('ProductMainImage');
            return {
              clicked: true,
              thumbSrc: sideThumbs[1].dataset.mediaUrl,
              mainImgSrc: mainImg ? mainImg.getAttribute('src') : null,
              activeThumbIdx: Array.from(sideThumbs).findIndex(t => t.classList.contains('active'))
            };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true
    });
    console.log('Desktop side thumb click test result:', JSON.stringify(res.result.value));

    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot after clicking 2nd thumb
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const outDir = 'C:\\Users\\sharm\\.gemini\\antigravity\\brain\\2e1975ed-a550-4daa-8eeb-09f7e34cda42';
    fs.writeFileSync(path.join(outDir, 'current_desktop_pdp_thumb_active.png'), Buffer.from(ss.data, 'base64'));
    console.log('Saved current_desktop_pdp_thumb_active.png');

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
    server.close();
    process.exit(0);
  }
});
