const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const PORT = process.env.PORT || 3000;

// ── Telegram credentials from Railway environment variables ──
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

const MIME = {
  '.html':'text/html','.css':'text/css','.js':'application/javascript',
  '.svg':'image/svg+xml','.ico':'image/x-icon','.png':'image/png','.jpg':'image/jpeg'
};

// Inject credentials into HTML before serving
function injectConfig(html) {
  const inject = `<script>
const TELEGRAM_BOT_TOKEN = '${BOT_TOKEN}';
const TELEGRAM_CHAT_ID = '${CHAT_ID}';
</script>`;
  return html.replace('<head>', '<head>\n' + inject);
}

http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // Save submissions
  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        fs.appendFileSync(path.join(BASE, 'submissions.json'), JSON.stringify(JSON.parse(body)) + '\n');
        res.writeHead(200); res.end('OK');
      } catch(e) { res.writeHead(500); res.end(); }
    });
    return;
  }

  // Serve static files
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(BASE, urlPath);

  if (!filePath.startsWith(BASE)) { res.writeHead(403); res.end(); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }

    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'text/plain';

    // Inject credentials into HTML files
    if (ext === '.html') {
      const injected = injectConfig(data.toString('utf8'));
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(injected);
    } else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });

}).listen(PORT, () => {
  process.stdout.write('Running on port ' + PORT + '\n');
});
