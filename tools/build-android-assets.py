#!/usr/bin/env python3
"""Собрать контент Android-приложения из корня репозитория.

    python3 tools/build-android-assets.py [--check]

Копирует сайт (те же файлы, что уходят на GitHub Pages) в
android/app/src/main/assets/www/, откуда его забирает Gradle при сборке APK.

Каталог-приёмник намеренно не хранится в git: единственный источник правды —
корень репозитория. Поэтому любое изменение в main автоматически попадает и
на сайт, и в офлайн-сборку, и в APK — при следующей сборке.

--check ничего не копирует, а только проверяет, что все ожидаемые файлы на
месте (используется в CI перед сборкой).
"""
import argparse
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEST = os.path.join(ROOT, "android", "app", "src", "main", "assets", "www")

# Каталоги, которые целиком уходят в приложение.
DIRS = ["vendor", "sec_img", "pfd", "docs_pdf", "fonts"]

# Файлы в корне, которые нужны приложению.
FILES = [
    "manifest.json",
    "service-worker.js",
    "logo.png",
    "icon-192.png",
    "icon-512.png",
]

# Корневые .js и .html подхватываются автоматически (см. ниже).
# Служебные файлы репозитория в приложение не попадают.
EXCLUDE_HTML = set()

ap = argparse.ArgumentParser()
ap.add_argument("--check", action="store_true", help="только проверить исходники")
a = ap.parse_args()


def html_files():
    names = sorted(n for n in os.listdir(ROOT) if n.lower().endswith(".html"))
    return [n for n in names if n not in EXCLUDE_HTML]


def js_files():
    return sorted(n for n in os.listdir(ROOT) if n.lower().endswith(".js"))


def missing_sources():
    bad = []
    for name in FILES:
        if not os.path.isfile(os.path.join(ROOT, name)):
            bad.append(name)
    for d in DIRS:
        if not os.path.isdir(os.path.join(ROOT, d)):
            bad.append(d + "/")
    if not html_files():
        bad.append("<корневые *.html>")
    if not js_files():
        bad.append("<корневые *.js>")
    return bad


def copy_tree(src, dst):
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def main():
    bad = missing_sources()
    if bad:
        print("Не найдены обязательные исходники:", ", ".join(bad), file=sys.stderr)
        return 1

    if a.check:
        total = len(html_files()) + len(js_files()) + len(FILES)
        for d in DIRS:
            total += sum(len(f) for _, _, f in os.walk(os.path.join(ROOT, d)))
        print("OK: исходники на месте, файлов к копированию: %d" % total)
        return 0

    os.makedirs(DEST, exist_ok=True)

    count = 0
    for name in html_files() + js_files() + FILES:
        shutil.copy2(os.path.join(ROOT, name), os.path.join(DEST, name))
        count += 1

    for d in DIRS:
        copy_tree(os.path.join(ROOT, d), os.path.join(DEST, d))
        count += sum(len(f) for _, _, f in os.walk(os.path.join(ROOT, d)))

    size = sum(
        os.path.getsize(os.path.join(dp, f))
        for dp, _, fs in os.walk(DEST)
        for f in fs
    )
    print("OK: %d файлов, %.1f МБ -> %s" % (count, size / 1e6, os.path.relpath(DEST, ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
