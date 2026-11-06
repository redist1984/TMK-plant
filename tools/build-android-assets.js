#!/usr/bin/env node
/*
 * Собрать контент Android-приложения из корня репозитория.
 *
 *   node tools/build-android-assets.js           скопировать в assets/www
 *   node tools/build-android-assets.js --check    только проверить исходники
 *
 * Копирует сайт (те же файлы, что уходят на GitHub Pages) в
 * android/app/src/main/assets/www/, откуда его забирает Gradle.
 *
 * Каталог-приёмник не хранится в git: единственный источник правды — корень
 * репозитория. Поэтому любое изменение попадает и на сайт, и в офлайн-сборку,
 * и в APK — при следующей сборке.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'www');
const P = (...p) => path.join(ROOT, ...p);

// Каталоги, которые целиком уходят в приложение.
const DIRS = ['vendor', 'sec_img', 'pfd', 'dcs', 'docs_pdf', 'fonts'];

// Файлы в корне, которые нужны приложению.
const FILES = ['manifest.json', 'service-worker.js', 'logo.png', 'icon-192.png', 'icon-512.png'];

const CHECK = process.argv.includes('--check');

const htmlFiles = () =>
  fs.readdirSync(ROOT).filter((n) => n.toLowerCase().endsWith('.html') && n !== 'model_test.html').sort();
const jsFiles = () => fs.readdirSync(ROOT).filter((n) => n.toLowerCase().endsWith('.js')).sort();

function missingSources() {
  const bad = [];
  for (const f of FILES) if (!fs.existsSync(P(f))) bad.push(f);
  for (const d of DIRS) if (!fs.existsSync(P(d))) bad.push(d + '/');
  if (!htmlFiles().length) bad.push('<корневые *.html>');
  if (!jsFiles().length) bad.push('<корневые *.js>');
  return bad;
}

function countFiles(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) n += countFiles(path.join(dir, e.name));
    else n++;
  }
  return n;
}

function main() {
  const bad = missingSources();
  if (bad.length) {
    console.error('Не найдены обязательные исходники: ' + bad.join(', '));
    return 1;
  }

  if (CHECK) {
    let total = htmlFiles().length + jsFiles().length + FILES.length;
    for (const d of DIRS) total += countFiles(P(d));
    console.log('OK: исходники на месте, файлов к копированию: ' + total);
    return 0;
  }

  fs.mkdirSync(DEST, { recursive: true });

  let count = 0;
  for (const name of [...htmlFiles(), ...jsFiles(), ...FILES]) {
    fs.copyFileSync(P(name), path.join(DEST, name));
    count++;
  }

  for (const d of DIRS) {
    const dst = path.join(DEST, d);
    fs.rmSync(dst, { recursive: true, force: true });
    fs.cpSync(P(d), dst, { recursive: true });
    count += countFiles(P(d));
  }

  let size = 0;
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else size += fs.statSync(full).size;
    }
  };
  walk(DEST);

  console.log(
    'OK: ' + count + ' файлов, ' + (size / 1e6).toFixed(1) + ' МБ -> ' + path.relative(ROOT, DEST)
  );
  return 0;
}

process.exit(main());
