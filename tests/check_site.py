#!/usr/bin/env python3
"""Automated checks for the GitHub Pages site: links, config paths, nav/buttons and JavaScript syntax."""
import json
import os
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
os.chdir(ROOT)
errors = []

NODE = "const fs=require('fs');const w={};new Function('window',fs.readFileSync('js/config.js','utf8'))(w);process.stdout.write(JSON.stringify(w.WEBRIC_CONFIG));"
cfg = json.loads(subprocess.check_output(['node', '-e', NODE]))


def has_path(path):
    cur = cfg
    for k in path.split('.'):
        if isinstance(cur, list):
            if not k.isdigit() or int(k) >= len(cur):
                return False
            cur = cur[int(k)]
        elif isinstance(cur, dict) and k in cur:
            cur = cur[k]
        else:
            return False
    return True


def exists(target):
    return (ROOT / target).exists()


nav_ids = {n['id'] for n in cfg['nav']}
button_keys = set(cfg['buttons'])

for n in cfg['nav']:
    if not exists(n['href']):
        errors.append(f"config: nav link missing file {n['href']}")
for t in cfg['pages']['home']['tiles']:
    if not exists(t['href']):
        errors.append(f"config: home card link missing file {t['href']}")

for f in sorted(ROOT.glob('*.html')):
    s = f.read_text(encoding='utf-8')
    if '<title>' not in s:
        errors.append(f'{f.name}: missing <title>')
    for m in re.finditer(r"(?:href|src)=['\"]([^'\"#?]+)", s):
        target = m.group(1)
        if target.startswith(('http://', 'https://', 'mailto:', 'data:', '//')):
            continue
        if not exists(target):
            errors.append(f'{f.name}: missing file {target}')
    for m in re.finditer(r"data-cfg=['\"]([^'\"]+)", s):
        if not has_path(m.group(1)):
            errors.append(f'{f.name}: unknown config path {m.group(1)}')
    for m in re.finditer(r"data-cfg-attr=['\"][^'\"]*:([^'\"]+)", s):
        if not has_path(m.group(1)):
            errors.append(f'{f.name}: unknown config path {m.group(1)}')
    for m in re.finditer(r"data-nav=['\"]([^'\"]+)", s):
        if m.group(1) not in nav_ids:
            errors.append(f'{f.name}: unknown nav id {m.group(1)}')
    for m in re.finditer(r"data-btn=['\"]([^'\"]+)", s):
        if m.group(1) not in button_keys:
            errors.append(f'{f.name}: unknown button key {m.group(1)}')

for js in sorted(ROOT.glob('js/*.js')):
    r = subprocess.run(['node', '--check', str(js)], capture_output=True, text=True)
    if r.returncode != 0:
        errors.append(f'{js.relative_to(ROOT)}: JavaScript syntax error\n{r.stderr.strip()}')

if errors:
    print('\n'.join(errors))
    print(f'{len(errors)} problem(s) found')
    sys.exit(1)
print('All site checks passed.')
