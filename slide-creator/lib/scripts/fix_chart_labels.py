#!/usr/bin/env python3
"""
fix_chart_labels.py - pptxgenjs生成PPTXのチャート修正

1. multiLvlStrRef → strRef 変換（PowerPoint互換性）
2. 東アジアフォント（a:ea）注入（日本語文字化け防止）
3. lang="ja-JP" 設定

Usage:
    python fix_chart_labels.py input.pptx [output.pptx]
    (output省略時はinputを上書き)
"""

import zipfile
import shutil
import os
import re
import sys
import tempfile

EA_FONT = 'Yu Gothic UI'


def fix_chart_labels(pptx_path, output_path=None):
    if output_path is None:
        output_path = pptx_path

    tmp_dir = tempfile.mkdtemp()
    fixed_count = 0

    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            z.extractall(tmp_dir)

        chart_dir = os.path.join(tmp_dir, 'ppt', 'charts')
        if os.path.exists(chart_dir):
            for fname in sorted(os.listdir(chart_dir)):
                if not fname.endswith('.xml'):
                    continue
                fpath = os.path.join(chart_dir, fname)
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()

                original = content
                needs_label_fix = 'multiLvlStrRef' in content
                needs_font_fix = '<a:latin' in content and '<a:ea ' not in content

                if not needs_label_fix and not needs_font_fix:
                    continue

                # --- Fix 1: multiLvlStrRef → strRef ---
                if needs_label_fix:
                    content = content.replace('<c:multiLvlStrRef>', '<c:strRef>')
                    content = content.replace('</c:multiLvlStrRef>', '</c:strRef>')
                    content = content.replace('<c:multiLvlStrCache>', '<c:strCache>')
                    content = content.replace('</c:multiLvlStrCache>', '</c:strCache>')
                    content = re.sub(r'<c:lvl>\s*', '', content)
                    content = re.sub(r'\s*</c:lvl>', '', content)

                # --- Fix 2: Inject East Asian + Complex Script fonts ---
                if needs_font_fix:
                    content = re.sub(
                        r'(<a:latin typeface="[^"]*"/>)(?!\s*<a:ea )',
                        rf'\1<a:ea typeface="{EA_FONT}"/><a:cs typeface="{EA_FONT}"/>',
                        content
                    )
                    # Set language to ja-JP
                    content = re.sub(
                        r'<a:endParaRPr\b([^>]*)lang="[^"]*"',
                        r'<a:endParaRPr\1lang="ja-JP"',
                        content
                    )

                if content != original:
                    with open(fpath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixes = []
                    if needs_label_fix:
                        fixes.append('labels')
                    if needs_font_fix:
                        fixes.append('fonts')
                    print(f'  Fixed: {fname} ({"+".join(fixes)})')
                    fixed_count += 1

        if fixed_count == 0:
            print('  No fixes needed.')
            return

        # Rezip
        tmp_out = output_path + '.tmp'
        with zipfile.ZipFile(tmp_out, 'w', zipfile.ZIP_DEFLATED) as zout:
            for root, dirs, files in os.walk(tmp_dir):
                for file in files:
                    fpath = os.path.join(root, file)
                    arcname = os.path.relpath(fpath, tmp_dir)
                    zout.write(fpath, arcname)

        if os.path.exists(output_path):
            os.remove(output_path)
        os.rename(tmp_out, output_path)
        print(f'Done: {output_path}')

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: fix_chart_labels.py input.pptx [output.pptx]')
        sys.exit(1)
    inp = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else None
    fix_chart_labels(inp, out)
