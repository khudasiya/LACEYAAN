const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8892;
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/preview_public_store.html';
  const filePath = path.join(__dirname, '..', reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200); res.end(data);
  });
});
server.listen(PORT, '127.0.0.1');

const proc = cp.spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9446',
  '--no-sandbox',
  '--disable-gpu',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const version = JSON.parse(await get('http://127.0.0.1:9446/json/version'));
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    let id = 1;
    const cbs = new Map();
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      if (d.id && cbs.has(d.id)) { cbs.get(d.id)(d.result); cbs.delete(d.id); }
    };
    await new Promise(r => ws.onopen = r);
    function call(method, params={}) {
      return new Promise(r => { const i = id++; cbs.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    }

    const { targetId } = await call('Target.createTarget', { url: `http://127.0.0.1:${PORT}/preview_public_store.html` });
    const { sessionId } = await call('Target.attachToTarget', { targetId, flatten: true });
    function callS(method, params={}) {
      return new Promise(r => { const i = id++; cbs.set(i, r); ws.send(JSON.stringify({ id: i, sessionId, method, params })); });
    }

    await callS('Emulation.setDeviceMetricsOverride', { width: 320, height: 640, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 600));

    const res = await callS('Runtime.evaluate', {
      expression: `(() => {
        const section = document.querySelector('.before-after-section');
        const items = [];
        if (section) {
          section.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            const s = window.getComputedStyle(el);
            if (r.width > 288 || r.right > 320) {
              items.push({
                tag: el.tagName,
                cls: typeof el.className === 'string' ? el.className : '',
                id: el.id,
                w: Math.round(r.width),
                l: Math.round(r.left),
                r: Math.round(r.right),
                pad: s.padding,
                minW: s.minWidth,
                maxW: s.maxWidth
              });
            }
          });
        }
        return items;
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(res.result.value, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    proc.kill();
    server.close();
    process.exit(0);
  }
}, 1000);

function get(url) {
  return new Promise((res, rej) => {
    http.get(url, r => {
      let b = '';
      r.on('data', c => b += c);
      r.on('end', () => res(b));
    }).on('error', rej);
  });
}
