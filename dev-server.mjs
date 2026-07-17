// Lokale dev-server: serveert de statische app en mount de Vercel-functies
// uit api/ met dezelfde req/res-vorm als op Vercel. Env komt uit .env.local.
// Gebruik: node dev-server.mjs [poort]   (standaard 3000)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 3000);

// .env.local inlezen (KEY=VALUE, # is commentaar)
for (const file of ['.env.local', '.env']) {
  const p = path.join(ROOT, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function vercelify(req, res, url) {
  req.query = Object.fromEntries(url.searchParams);
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
    return res;
  };
  res.send = (body) => { res.end(body); return res; };
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return undefined;
  const raw = Buffer.concat(chunks).toString('utf8');
  const type = req.headers['content-type'] || '';
  if (type.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      const name = url.pathname.slice('/api/'.length).replace(/\/$/, '');
      const file = path.join(ROOT, 'api', `${name}.js`);
      if (!/^[\w-]+$/.test(name) || !existsSync(file)) {
        res.statusCode = 404;
        return res.end('Not found');
      }
      const mod = await import(pathToFileURL(file).href);
      vercelify(req, res, url);
      req.body = await readBody(req);
      await mod.default(req, res);
      if (!res.writableEnded) res.end();
      return;
    }

    // Statische bestanden; cleanUrls: /foo → foo.html, / → index.html
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    let file = path.join(ROOT, rel);
    if (!path.normalize(file).startsWith(ROOT)) { res.statusCode = 403; return res.end('Forbidden'); }
    if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
    if (!existsSync(file)) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.statusCode = 500;
    if (!res.writableEnded) res.end(JSON.stringify({ error: String(err?.message || err) }));
  }
});

server.listen(PORT, () => {
  console.log(`HVP Procesturing draait op http://localhost:${PORT}`);
});
