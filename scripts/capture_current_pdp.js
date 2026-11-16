const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8891;
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
  if (reqPath === '/') reqPath = '/preview_product.html';
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
  const chromeProc = cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844'
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
    const targets = await httpGet('http://127.0.0.1:9231/json');
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

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/preview_product.html` });
    await new Promise(r => setTimeout(r, 2000));

    const ssMobile = await send('Page.captureScreenshot', { format: 'png' });
    const outDir = 'C:\\Users\\sharm\\.gemini\\antigravity\\brain\\2e1975ed-a550-4daa-8eeb-09f7e34cda42';
    fs.writeFileSync(path.join(outDir, 'current_mobile_pdp.png'), Buffer.from(ssMobile.data, 'base64'));
    console.log('Saved current_mobile_pdp.png');

    // Scroll down 450px
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 520);`
    });
    await new Promise(r => setTimeout(r, 600));

    const ssMobile2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'current_mobile_pdp_lower.png'), Buffer.from(ssMobile2.data, 'base64'));
    console.log('Saved current_mobile_pdp_lower.png');

    // Scroll down further for description and pincode checker
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 400);`
    });
    await new Promise(r => setTimeout(r, 600));

    const ssMobile3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'current_mobile_pdp_pincode.png'), Buffer.from(ssMobile3.data, 'base64'));
    console.log('Saved current_mobile_pdp_pincode.png');

    ws.close();
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    chromeProc.kill();
    server.close();
    process.exit(0);
  }
});
