const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8896;
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
  const chromeProc = cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9337',
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const versionRes = await fetch('http://127.0.0.1:9337/json/version');
    const versionData = await versionRes.json();
    const ws = new WebSocket(versionData.webSocketDebuggerUrl);

    let id = 1;
    const cbs = new Map();
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && cbs.has(d.id)) {
        const { res, rej } = cbs.get(d.id);
        cbs.delete(d.id);
        if (d.error) rej(d.error); else res(d.result);
      }
    };
    await new Promise(r => ws.onopen = r);
    function send(method, params = {}) {
      return new Promise((res, rej) => {
        const msgId = id++;
        cbs.set(msgId, { res, rej });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    const { targetId } = await send('Target.createTarget', { url: `http://127.0.0.1:${PORT}/preview_public_store.html` });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        cbs.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id, sessionId, method, params }));
      });
    }

    await sendSession('Page.enable');
    await sendSession('DOM.enable');

    // Desktop screenshot
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 1440, height: 900, deviceScaleFactor: 1, mobile: false
    });
    await new Promise(r => setTimeout(r, 1000));
    
    // Capture hero
    const heroShot = await sendSession('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    fs.writeFileSync(path.join(__dirname, '..', 'test_screenshots', 'audit_desktop_hero.jpg'), Buffer.from(heroShot.data, 'base64'));

    // Mobile screenshot
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 390, height: 844, deviceScaleFactor: 2, mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));
    const mobileShot = await sendSession('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    fs.writeFileSync(path.join(__dirname, '..', 'test_screenshots', 'audit_mobile_hero.jpg'), Buffer.from(mobileShot.data, 'base64'));

    console.log('Screenshots captured successfully');

    ws.close();
    chromeProc.kill();
    server.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    chromeProc.kill();
    server.close();
    process.exit(1);
  }
});
