const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html'));

test('customer-data screenshots are absent from public assets and page references', () => {
  for (const name of ['projects-3.png', 'projects-4.png']) {
    assert.equal(fs.existsSync(path.join(root, 'assets', 'projects', name)), false);
    for (const file of pages) {
      assert.equal(fs.readFileSync(path.join(root, file), 'utf8').includes(name), false);
    }
  }
});

for (const file of pages) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  test(`${file}: local links, assets, and fragments resolve`, () => {
    for (const [, value] of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(value, `https://portfolio.test/${file}`);
      if (url.origin !== 'https://portfolio.test') continue;
      const target = path.join(root, decodeURIComponent(url.pathname));
      assert.ok(fs.existsSync(target), `${file}: missing ${value}`);
      if (!url.hash) continue;
      const content = fs.readFileSync(fs.statSync(target).isDirectory() ? path.join(target, 'index.html') : target, 'utf8');
      assert.ok(content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: missing fragment ${value}`);
    }
  });
  test(`${file}: valid metadata and a single primary heading`, () => {
    assert.equal([...source.matchAll(/<h1\b/g)].length, 1);
    assert.match(source, /<title>[^<]+<\/title>/);
    assert.match(source, /name="viewport"/);
    for (const [, data] of source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(data);
    if (/name="robots" content="noindex"/.test(source)) return;
    const canonical = file === 'index.html' ? '' : file;
    assert.ok(source.includes(`rel="canonical" href="https://muhammad-ibrahim-butt.github.io/${canonical}"`));
    const description = source.match(/name="description"\s+content="([^"]+)"/)[1];
    assert.ok(description.length > 70 && !description.endsWith('...'));
  });
}

test('sitemap lists each indexable page exactly once', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expected = pages.filter(file => !/name="robots" content="noindex"/.test(fs.readFileSync(path.join(root, file), 'utf8')))
    .map(file => `https://muhammad-ibrahim-butt.github.io/${file === 'index.html' ? '' : file}`);
  assert.deepEqual(urls.sort(), expected.sort());
});
