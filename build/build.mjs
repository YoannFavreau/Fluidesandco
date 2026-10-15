// Génère une page HTML complète (contenu inclus dans le fichier) pour chaque adresse du site.
// Les moteurs de recherche et les IA qui n'exécutent pas JavaScript lisent ainsi le vrai contenu.
//
// Usage (depuis le dossier build/) :
//   npm install
//   npm run build
//
// À relancer après toute modification de js/app.js (textes, FAQ, réalisations, avis...) ou de build/shell.html.
// Le script crée les dossiers, écrit chaque page à partir de shell.html, l'ouvre via un petit serveur local,
// puis enregistre la page complète. mentions-legales/index.html est un fichier à éditer à la main :
// le build ne touche qu'à son menu.

import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

// [clé de page, dossier]  ('' = racine du site)
export const PAGES = [
  ['home', ''],
  ['particuliers', 'particuliers'],
  ['plomberie', 'particuliers/plomberie'],
  ['chauffage', 'particuliers/chauffage'],
  ['climatisation', 'particuliers/climatisation'],
  ['pro', 'professionnels'],
  ['about', 'qui-suis-je'],
  ['contact', 'contact'],
];
export const STATIC_PAGES = ['mentions-legales'];

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };

function serve(siteDir) {
  const server = http.createServer(async (req, res) => {
    try {
      let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (rel.endsWith('/')) rel += 'index.html';
      const file = path.join(siteDir, rel);
      if (!file.startsWith(siteDir)) throw new Error('hors du site');
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    } catch { res.writeHead(404); res.end('404'); }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

const rootFor = (dir) => (dir ? '../'.repeat(dir.split('/').length) : '');

export async function build(puppeteer, launchOptions, siteDir) {
  siteDir = path.resolve(siteDir);
  const shell = await readFile(path.join(siteDir, 'build', 'shell.html'), 'utf8');
  const server = await serve(siteDir);
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await puppeteer.launch(launchOptions);
  const errors = [];
  try {
    const snap = async (dir) => {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });
      page.on('pageerror', (e) => errors.push(`${dir || '/'} : ${e.message}`));
      page.on('requestfailed', (r) => errors.push(`${dir || '/'} : ressource introuvable ${r.url()}`));
      page.on('response', (r) => { if (r.status() >= 400) errors.push(`${dir || '/'} : ${r.status()} ${r.url()}`); });
      await page.goto(base + (dir ? dir + '/' : ''), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 400));
      await page.evaluate(() => { const b = document.getElementById('ck'); if (b) b.remove(); document.querySelectorAll('script[src*="googletagmanager"]').forEach((x) => x.remove()); });
      const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML + '\n');
      await page.close();
      return html;
    };
    for (const [key, dir] of PAGES) {
      const root = rootFor(dir);
      const skeleton = shell.replaceAll('{{ROOT}}', root).replaceAll('{{HOME}}', root || './')
        .replaceAll('{{PAGE}}', key).replaceAll('{{TITLE}}', 'Fluides &amp; Co');
      const target = path.join(siteDir, dir, 'index.html');
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, skeleton);
      const html = await snap(dir);
      await writeFile(target, html);
      console.log('✔', (dir ? dir + '/' : '') + 'index.html', `(${Math.round(html.length / 1024)} Ko)`);
    }
    for (const dir of STATIC_PAGES) {
      const full = path.join(siteDir, dir, 'index.html');
      try { await access(full); } catch { continue; }
      await writeFile(full, await snap(dir));
      console.log('✔', dir + '/index.html', '(statique, menu actualisé)');
    }
  } finally {
    await browser.close();
    server.close();
  }
  if (errors.length) throw new Error('Problèmes détectés :\n' + errors.join('\n'));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const puppeteer = (await import('puppeteer')).default;
  const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  await build(puppeteer, { headless: true, args: ['--no-sandbox'] }, siteDir);
}
