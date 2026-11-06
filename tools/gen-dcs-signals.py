import io
import json
import os
import re
import sys

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'twin', 'dcs-signals.data.js')

COL_TAG = 3
COL_DESC = 9
COL_RANGE = 18
COL_UNIT = 22
COL_SP = 25
COL_HH = 32
COL_H = 34
COL_L = 36
COL_LL = 38
COL_SIGNAL = 56


def cell(row, col):
    if col - 1 >= len(row):
        return None
    v = row[col - 1]
    if v is None:
        return None
    s = str(v).strip()
    return s or None


def num(s):
    if s is None:
        return None
    m = re.search(r'-?\d+(?:[.,]\d+)?', s)
    return float(m.group(0).replace(',', '.')) if m else None


def parse_range(s):
    if not s:
        return None
    parts = re.split(r'[~～\-–—]', s)
    if len(parts) >= 2:
        lo, hi = num(parts[0]), num(parts[1])
        if lo is not None and hi is not None:
            return [lo, hi]
    return None


def main(path):
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    signals = {}
    depts = {}
    for ws in wb.worksheets:
        rows = list(ws.iter_rows(min_row=1, max_row=ws.max_row, max_col=60, values_only=True))
        hdr = None
        for i, r in enumerate(rows[:10]):
            if any(v is not None and 'Позиция' in str(v) for v in r):
                hdr = i
                break
        if hdr is None:
            continue
        m = re.match(r'\s*(\d+(?:\.\d+)?)', ws.title)
        dept = m.group(1) if m else ws.title

        for r in rows[hdr + 1:]:
            tag = cell(r, COL_TAG)
            if not tag or not re.match(r'^[A-Za-z]', tag):
                continue
            if tag in signals:
                continue
            rec = {
                'dept': dept,
                'desc': cell(r, COL_DESC),
                'range': parse_range(cell(r, COL_RANGE)),
                'unit': cell(r, COL_UNIT),
                'sp': num(cell(r, COL_SP)),
                'HH': num(cell(r, COL_HH)),
                'H': num(cell(r, COL_H)),
                'L': num(cell(r, COL_L)),
                'LL': num(cell(r, COL_LL)),
                'signal': cell(r, COL_SIGNAL),
            }
            if any(rec[k] is not None for k in ('range', 'sp', 'HH', 'H', 'L', 'LL')):
                signals[tag] = rec
                depts[dept] = depts.get(dept, 0) + 1
    wb.close()

    data = {'source': os.path.basename(path), 'count': len(signals),
            'by_dept': depts, 'signals': dict(sorted(signals.items()))}
    js = ('/* Сгенерировано tools/gen-dcs-signals.py — не править вручную.\n'
          '   Источник: %s */\n' % os.path.basename(path))
    js += '(function (root) {\n  var D = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n'
    js += "  if (typeof module !== 'undefined' && module.exports) module.exports = D;\n"
    js += '  else root.TWIN_SIGNALS = D;\n'
    js += "})(typeof self !== 'undefined' ? self : this);\n"
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(js)

    lim = sum(1 for s in signals.values() if any(s[k] is not None for k in ('HH', 'H', 'L', 'LL')))
    rng = sum(1 for s in signals.values() if s['range'])
    print('приборов: %d | с диапазоном: %d | с уставками: %d' % (len(signals), rng, lim))
    # названия листов могут содержать китайские символы — в консоли cp1251 это падает
    print('отделений: %d' % len(depts))
    print('файл: ' + OUT)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__ or 'укажите путь к xlsx')
        sys.exit(2)
    main(sys.argv[1])
