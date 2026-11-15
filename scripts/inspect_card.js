const http = require('http');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8895;
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
  const filePath = path.join(__dirname, '..', reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
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
    '--remote-debugging-port=9336',
    '--no-sandbox',
    '--disable-gpu',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  try {
    const versionRes = await fetch('http://127.0.0.1:9336/json/version');
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
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    const { targetId } = await send('Target.createTarget', { url: `http://127.0.0.1:${PORT}/preview_collection.html` });
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

    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 375, height: 812, deviceScaleFactor: 2, mobile: true
    });
    await new Promise(r => setTimeout(r, 800));

    const evalRes = await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const grid = document.querySelector('.main-collection-section .product-grid-layout');
        const card = document.querySelector('.main-collection-section .product-card-editorial');
        
        function getInfo(el) {
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            tag: el.tagName,
            cls: el.className,
            rectWidth: rect.width,
            rectRight: rect.right,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            offsetWidth: el.offsetWidth,
            minWidth: cs.minWidth,
            maxWidth: cs.maxWidth,
            width: cs.width,
            flex: cs.flex,
            gridTemplateColumns: cs.gridTemplateColumns,
            whiteSpace: cs.whiteSpace
          };
        }

        const cardChildren = card ? Array.from(card.querySelectorAll('*')).map(getInfo) : [];

        return {
          windowInner: window.innerWidth,
          docScroll: document.documentElement.scrollWidth,
          grid: getInfo(grid),
          card: getInfo(card),
          cardChildren: cardChildren.filter(c => c && (c.rectWidth > 200 || c.scrollWidth > 200))
        };
      })()`,
      returnByValue: true
    });

    console.log(JSON.stringify(evalRes.result.value, null, 2));

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
