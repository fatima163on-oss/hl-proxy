const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const opts = { hostname: 'api.hyperliquid.xyz', path: '/info', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': body.length } };
    const pr = https.request(opts, r => { res.writeHead(r.statusCode, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); r.pipe(res); });
    pr.on('error', e => { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); });
    pr.write(body);
    pr.end();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log('Proxy running on port ' + PORT));