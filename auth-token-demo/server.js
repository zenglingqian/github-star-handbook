const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || 'local-demo-secret-change-me';
const DEMO_USER = process.env.DEMO_USER || 'demo';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'demo1234';
const PAGE = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

function b64url(value) {
  return Buffer.from(value).toString('base64url');
}
function signToken(payload) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}
function verifyToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const data = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(data).digest();
  let actual;
  try { actual = Buffer.from(parts[2], 'base64url'); } catch { return null; }
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')); } catch { return null; }
  if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
  return payload;
}
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
}
function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 16_384) reject(new Error('Request too large')); });
    req.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(PAGE);
  }
  if (req.method === 'POST' && url.pathname === '/api/login') {
    try {
      const { username, password } = await readJson(req);
      const valid = typeof username === 'string' && typeof password === 'string' &&
        username === DEMO_USER && password === DEMO_PASSWORD;
      if (!valid) return send(res, 401, { error: '用户名或密码不正确' });
      const now = Math.floor(Date.now() / 1000);
      const accessToken = signToken({ sub: username, iat: now, exp: now + 900 });
      return send(res, 200, { access_token: accessToken, token_type: 'Bearer', expires_in: 900 });
    } catch (error) {
      return send(res, 400, { error: error.message });
    }
  }
  if (req.method === 'GET' && url.pathname === '/api/profile') {
    const match = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
    const claims = match ? verifyToken(match[1]) : null;
    if (!claims) return send(res, 401, { error: '缺少、无效或已过期的访问令牌' });
    return send(res, 200, { username: claims.sub, message: '这是受保护的后端数据。' });
  }
  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => console.log(`Auth demo ready at http://localhost:${PORT}`));
