/**
 * slide-templates.js
 * pptxgenjs スライドテンプレートライブラリ
 * 
 * 使い方:
 *   const T = require('.../slide-templates');
 *   const s = pres.addSlide();
 *   T.horizontal3(pres, s, { title: '...', items: [...] }, T.DEFAULT_THEME);
 */

const SW = 10, SH = 5.625;

const DEFAULT_THEME = {
  navy:    '1B3254',
  navyL:   '2A4A75',
  teal:    '2E7D8E',
  red:     'C45B5B',
  white:   'FFFFFF',
  bgLight: 'F5F7FA',
  bgAlt:   'EEF1F6',
  border:  'D0D8E8',
  textDark:'1A1F2E',
  textMid: '3D4F6B',
  textMute:'7A8BA8',
  gold:    'C8A951',
  green:   '2E7D5A',
  greenL:  'EAF5EF',
  font:    'Calibri',
};

// ─── ヘルパー ─────────────────────────────────────────────────────────────────

const mkShadow = () => ({ type: 'outer', blur: 6, offset: 2, angle: 135, color: '000000', opacity: 0.08 });

function addHeader(s, title, sub = '', C = DEFAULT_THEME) {
  // 左端ネイビーバー
  s.addShape('rect', { x: 0, y: 0, w: 0.12, h: SH, fill: { color: C.navy }, line: { color: C.navy } });
  // タイトル左のティールアクセント
  s.addShape('rect', { x: 0.28, y: 0.18, w: 0.06, h: 0.55, fill: { color: C.teal }, line: { color: C.teal } });
  // タイトル
  s.addText(title, {
    x: 0.42, y: 0.16, w: 9.3, h: 0.60,
    fontSize: 20, bold: true, color: C.navy, fontFace: C.font, valign: 'middle', margin: 0
  });
  // サブタイトル
  if (sub) {
    s.addText(sub, {
      x: 0.42, y: 0.74, w: 9.3, h: 0.26,
      fontSize: 11, color: C.textMute, fontFace: C.font, valign: 'top', margin: 0
    });
  }
}

function addFooter(s, num = '', total = '', label = '', C = DEFAULT_THEME) {
  s.addShape('rect', { x: 0, y: SH - 0.32, w: SW, h: 0.32, fill: { color: C.bgLight }, line: { color: C.border, pt: 0.5 } });
  s.addText(label, {
    x: 0.3, y: SH - 0.30, w: 5.0, h: 0.26,
    fontSize: 9, color: C.textMute, fontFace: C.font, margin: 0
  });
  if (num !== '') {
    const pageStr = total ? `${num} / ${total}` : String(num);
    s.addText(pageStr, {
      x: 8.8, y: SH - 0.30, w: 0.9, h: 0.26,
      fontSize: 9, color: C.textMute, align: 'right', fontFace: C.font, margin: 0
    });
  }
}

function addMsgBar(s, text, C = DEFAULT_THEME, y = 4.84) {
  s.addShape('rect', { x: 0.28, y, w: 9.44, h: 0.42, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText(text, {
    x: 0.45, y, w: 9.1, h: 0.42,
    fontSize: 12, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0
  });
}

function _getChartLayout(msgBar = '', insights) {
  const chartH = msgBar ? 3.5 : 4.0;
  if (insights && insights.length) {
    return {
      chartX: 0.28,
      chartY: 1.08,
      chartW: 5.66,
      chartH,
      panelX: 6.12,
      panelY: 1.08,
      panelW: 3.6,
      panelH: chartH,
    };
  }
  return {
    chartX: 0.28,
    chartY: 1.08,
    chartW: 9.44,
    chartH,
  };
}

function _addInsightPanel(s, x, y, w, h, insights, title = 'Key Insights', C = DEFAULT_THEME) {
  const items = (insights || []).filter(Boolean).slice(0, 5);
  s.addShape('rect', {
    x, y, w, h,
    fill: { color: C.bgLight },
    line: { color: C.border, pt: 1 },
    shadow: mkShadow()
  });
  s.addShape('rect', {
    x, y, w, h: 0.42,
    fill: { color: C.navy },
    line: { color: C.navy }
  });
  s.addText(title || 'Key Insights', {
    x: x + 0.14, y: y + 0.02, w: w - 0.28, h: 0.36,
    fontSize: 12, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0
  });

  if (!items.length) return;

  const topY = y + 0.58;
  const rowGap = 0.09;
  const itemH = Math.min(0.56, (h - 0.72 - rowGap * (items.length - 1)) / items.length);
  items.forEach((insight, i) => {
    const iy = topY + i * (itemH + rowGap);
    s.addShape('ellipse', {
      x: x + 0.16, y: iy + 0.12, w: 0.10, h: 0.10,
      fill: { color: C.teal },
      line: { color: C.teal }
    });
    s.addText(String(insight), {
      x: x + 0.32, y: iy, w: w - 0.48, h: itemH,
      fontSize: 11, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0
    });
  });
}

// ─── 【並列系】 ───────────────────────────────────────────────────────────────

/**
 * horizontal3 - 横並び3列カード
 * data: { title, sub?, footerLabel?, footerNum?, items: [{num?, label, body}×3], msgBar? }
 */
function horizontal3(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', items = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const CW = 3.0, CH = 3.5, GAP = 0.07;
  const SX = 0.28, SY = 1.08;
  const hasMsgBar = !!msgBar;
  const cardH = hasMsgBar ? 3.35 : 3.5;

  items.slice(0, 3).forEach((item, i) => {
    const x = SX + i * (CW + GAP);
    s.addShape('rect', { x, y: SY, w: CW, h: cardH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
    s.addShape('rect', { x, y: SY, w: CW, h: 0.42, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(item.label, {
      x: x + 0.12, y: SY + 0.02, w: CW - 0.24, h: 0.38,
      fontSize: 12, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0
    });
    if (item.num) {
      s.addText(item.num, {
        x: x + 0.12, y: SY + 0.52, w: CW - 0.24, h: 0.82,
        fontSize: 28, bold: true, color: C.teal, fontFace: C.font, align: 'center', valign: 'middle', margin: 0
      });
    }
    const bodyY = item.num ? SY + 1.42 : SY + 0.56;
    const bodyH = item.num ? cardH - 1.48 : cardH - 0.62;
    s.addText(item.body || '', {
      x: x + 0.15, y: bodyY, w: CW - 0.3, h: bodyH,
      fontSize: 12, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0
    });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * horizontal2 - 横並び2列（左右比較・ビフォーアフター対応）
 * data: { title, sub?, left: {label, items:[{text,muted?}]}, right: {label, items:[{text,bold?}]}, arrow?, msgBar? }
 */
function horizontal2(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', left, right, arrow = false, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const colW = 4.3, colH = 3.55, SX = 0.28, SY = 1.05;
  const hasMsgBar = !!msgBar;
  const ch = hasMsgBar ? 3.35 : colH;

  // 左カラム
  s.addShape('rect', { x: SX, y: SY, w: colW, h: ch, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 } });
  s.addShape('rect', { x: SX, y: SY, w: colW, h: 0.42, fill: { color: C.textMute }, line: { color: C.textMute } });
  s.addText(left.label, { x: SX, y: SY, w: colW, h: 0.42, fontSize: 14, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
  (left.items || []).forEach((item, i) => {
    const iy = SY + 0.58 + i * 0.62;
    const col = item.muted ? C.textMute : C.navy;
    s.addShape('rect', { x: SX + 0.12, y: iy + 0.09, w: 0.22, h: 0.22, fill: { color: col }, line: { color: col } });
    s.addText(item.text, { x: SX + 0.44, y: iy, w: colW - 0.56, h: 0.40, fontSize: 12, italic: !!item.muted, color: item.muted ? C.textMute : C.textDark, fontFace: C.font, valign: 'middle', margin: 0 });
  });

  // 矢印
  if (arrow) {
    s.addText('→', { x: SX + colW + 0.05, y: SY + ch / 2 - 0.3, w: 0.6, h: 0.6, fontSize: 30, bold: true, color: C.teal, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
  }

  // 右カラム
  const rx = SX + colW + (arrow ? 0.7 : 0.12);
  const rw = SW - rx - 0.28;
  s.addShape('rect', { x: rx, y: SY, w: rw, h: ch, fill: { color: 'EAF5F8' }, line: { color: C.teal, pt: 1 } });
  s.addShape('rect', { x: rx, y: SY, w: rw, h: 0.42, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText(right.label, { x: rx, y: SY, w: rw, h: 0.42, fontSize: 14, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
  (right.items || []).forEach((item, i) => {
    const iy = SY + 0.58 + i * 0.62;
    const col = item.bold ? C.teal : C.navyL;
    s.addShape('rect', { x: rx + 0.12, y: iy + 0.09, w: 0.22, h: 0.22, fill: { color: col }, line: { color: col } });
    s.addText(item.text, { x: rx + 0.44, y: iy, w: rw - 0.56, h: 0.40, fontSize: 12, bold: !!item.bold, color: item.bold ? C.teal : C.textDark, fontFace: C.font, valign: 'middle', margin: 0 });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * vertical - 縦並びカード（左番号バー + タイトル + 説明）
 * data: { title, sub?, items: [{num?, label, body}], msgBar? }
 */
function vertical(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', items = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const cnt = Math.min(items.length, 5);
  const gap = 0.08, SX = 0.28, SY = 1.08;
  const availH = msgBar ? 3.3 : 3.9;
  const itemH = Math.min(0.82, (availH - gap * (cnt - 1)) / cnt);
  items.slice(0, cnt).forEach((item, i) => {
    const y = SY + i * (itemH + gap);
    s.addShape('rect', { x: SX, y, w: 9.44, h: itemH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 } });
    s.addShape('rect', { x: SX, y, w: 0.44, h: itemH, fill: { color: C.navy }, line: { color: C.navy } });
    const numText = item.num != null ? String(item.num) : String(i + 1);
    s.addText(numText, { x: SX, y, w: 0.44, h: itemH, fontSize: 13, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    s.addText(item.label, { x: SX + 0.54, y: y + 0.06, w: 3.5, h: 0.36, fontSize: 13, bold: true, color: C.navy, fontFace: C.font, valign: 'top', margin: 0 });
    s.addText(item.body || '', { x: SX + 4.2, y: y + 0.06, w: 5.3, h: itemH - 0.12, fontSize: 12, color: C.textMid, fontFace: C.font, valign: 'middle', margin: 0 });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * grid2x2 - 2×2グリッドカード
 * data: { title, sub?, items: [{num?, label, body}×4], msgBar? }
 */
function grid2x2(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', items = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const CW = 4.45, CH = 1.88, GX = 0.2, GY = 0.15, SX = 0.28, SY = 1.10;
  items.slice(0, 4).forEach((item, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = SX + col * (CW + GX);
    const y = SY + row * (CH + GY);
    s.addShape('rect', { x, y, w: CW, h: CH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
    s.addShape('rect', { x, y, w: CW, h: 0.38, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(item.label, { x: x + 0.15, y, w: CW - 0.3, h: 0.38, fontSize: 12, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
    if (item.num) {
      s.addText(item.num, { x: x + 0.15, y: y + 0.44, w: 1.5, h: 0.72, fontSize: 18, bold: true, color: C.teal, fontFace: C.font, valign: 'middle', margin: 0 });
    }
    const bodyX = item.num ? x + 1.7 : x + 0.15;
    const bodyW = item.num ? CW - 1.85 : CW - 0.3;
    s.addText(item.body || '', { x: bodyX, y: y + 0.42, w: bodyW, h: CH - 0.52, fontSize: 11, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0 });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * grid3 - 3列カード（価格・比較等）
 * data: { title, sub?, items: [{label, price?, unit?, body?, src?}×3], msgBar? }
 */
function grid3(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', items = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const CW = 2.95, CH = 3.5, GAP = 0.18, SX = 0.28, SY = 1.08;
  const cardH = msgBar ? 3.35 : CH;

  items.slice(0, 3).forEach((item, i) => {
    const x = SX + i * (CW + GAP);
    s.addShape('rect', { x, y: SY, w: CW, h: cardH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
    s.addShape('rect', { x, y: SY, w: CW, h: 0.55, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(item.label, { x: x + 0.12, y: SY + 0.03, w: CW - 0.24, h: 0.50, fontSize: 12, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
    if (item.price) {
      s.addText(item.price, { x: x + 0.08, y: SY + 0.68, w: CW - 0.16, h: 0.75, fontSize: 20, bold: true, color: C.navy, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    }
    if (item.unit) {
      s.addShape('rect', { x: x + 0.25, y: SY + 1.48, w: CW - 0.5, h: 0.03, fill: { color: C.border }, line: { color: C.border } });
      s.addText(item.unit, { x: x + 0.08, y: SY + 1.58, w: CW - 0.16, h: 0.5, fontSize: 11, color: C.textMute, fontFace: C.font, align: 'center', margin: 0 });
    }
    if (item.body) {
      const bodyY = item.price ? SY + 2.15 : SY + 0.62;
      s.addText(item.body, { x: x + 0.12, y: bodyY, w: CW - 0.24, h: 0.9, fontSize: 11, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0 });
    }
    if (item.src) {
      s.addText('出典：' + item.src, { x: x + 0.08, y: SY + cardH - 0.35, w: CW - 0.16, h: 0.30, fontSize: 9, color: C.textMute, italic: true, fontFace: C.font, align: 'center', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

// ─── 【比較系】 ───────────────────────────────────────────────────────────────

/**
 * comparisonTable - 比較表
 * data: { title, sub?, headers: string[], rows: [{label, cells: string[], highlight?}], highlightCol?, msgBar? }
 * highlight=true の列はteal色強調
 */
function comparisonTable(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', headers = [], rows = [], highlightCol = -1, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const mk = (text, opts) => ({ text, options: { fontFace: C.font, fontSize: 11, valign: 'middle', ...opts } });
  const hdr = (t, hl) => mk(t, { bold: true, color: C.white, fill: { color: hl ? C.teal : C.navy }, align: 'center' });
  const lbl = (t) => mk(t, { bold: true, color: C.textDark, fill: { color: C.bgAlt }, align: 'left' });
  const cell = (t, hl) => mk(t, { color: hl ? C.teal : C.textMid, bold: !!hl, fill: { color: hl ? 'EAF5F8' : C.white }, align: 'center' });

  const headerRow = [hdr(''), ...headers.map((h, i) => hdr(h, i === highlightCol - 1))];
  const dataRows = rows.map(row => {
    const cells = row.cells.map((c, i) => cell(c, i === highlightCol - 1 || !!row.highlight));
    return [lbl(row.label), ...cells];
  });

  const totalCols = headers.length + 1;
  const labelW = 1.9;
  const dataW = (9.44 - labelW) / headers.length;
  const colW = [labelW, ...headers.map(() => dataW)];

  s.addTable([headerRow, ...dataRows], {
    x: 0.28, y: 1.08, w: 9.44,
    colW,
    border: { pt: 1, color: C.border },
    rowH: 0.50,
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * beforeAfter - ビフォーアフター
 * data: { title, sub?, beforeLabel?, afterLabel?, beforeItems: string[], afterItems: string[], msgBar? }
 */
function beforeAfter(pres, s, data, C = DEFAULT_THEME) {
  const { beforeItems = [], afterItems = [], beforeLabel = 'Before', afterLabel = 'After', ...rest } = data;
  const left = {
    label: beforeLabel,
    items: beforeItems.map(t => ({ text: t })),
  };
  const right = {
    label: afterLabel,
    items: afterItems.map(t => ({ text: t, bold: true })),
  };
  return horizontal2(pres, s, { arrow: true, left, right, ...rest }, C);
}

// ─── 【フロー系】 ─────────────────────────────────────────────────────────────

/**
 * flowHorizontal - 横型フロー
 * data: { title, sub?, steps: [{label, sub?, highlight?}], msgBar? }
 */
function flowHorizontal(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', steps = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = steps.length;
  const arrowW = 0.45;
  const totalW = 9.44;
  const boxW = (totalW - arrowW * (n - 1)) / n;
  const boxH = 1.2, SX = 0.28, SY = 1.9;

  steps.forEach((step, i) => {
    const x = SX + i * (boxW + arrowW);
    const fc = step.highlight ? C.teal : C.navy;
    s.addShape('rect', { x, y: SY, w: boxW, h: boxH, fill: { color: fc }, line: { color: fc }, shadow: mkShadow() });
    s.addText(step.label, { x, y: SY + 0.08, w: boxW, h: 0.52, fontSize: 13, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    if (step.sub) {
      s.addText(step.sub, { x, y: SY + 0.60, w: boxW, h: 0.52, fontSize: 11, color: step.highlight ? 'D0F0F8' : 'AABBDD', fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
    if (i < n - 1) {
      s.addText('→', { x: x + boxW, y: SY + boxH / 2 - 0.22, w: arrowW, h: 0.44, fontSize: 22, bold: true, color: C.teal, fontFace: C.font, align: 'center', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * flowVertical - 縦型フロー
 * data: { title, sub?, steps: [{num, label, body}], msgBar? }
 */
function flowVertical(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', steps = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(steps.length, 5);
  const itemH = msgBar ? (3.55 / n) - 0.08 : (4.0 / n) - 0.08;
  const SX = 0.28, SY = 1.08;

  steps.slice(0, n).forEach((step, i) => {
    const y = SY + i * (itemH + 0.08);
    s.addShape('rect', { x: SX, y, w: 9.44, h: itemH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 } });
    s.addShape('rect', { x: SX, y, w: 0.52, h: itemH, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText(String(step.num || i + 1), { x: SX, y, w: 0.52, h: itemH, fontSize: 13, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    s.addText(step.label, { x: SX + 0.62, y: y + 0.06, w: 3.0, h: itemH - 0.12, fontSize: 13, bold: true, color: C.navy, fontFace: C.font, valign: 'middle', margin: 0 });
    s.addText(step.body || '', { x: SX + 3.8, y: y + 0.06, w: 5.7, h: itemH - 0.12, fontSize: 11, color: C.textMid, fontFace: C.font, valign: 'middle', margin: 0 });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

// ─── 【分析系】 ───────────────────────────────────────────────────────────────

/**
 * matrix2x2 - 2×2マトリクス（ポジショニングマップ）
 * data: { title, sub?, xLabel:{low,high}, yLabel:{low,high}, items:[{label,x,y,size?,highlight?}], note? }
 */
/**
 * matrix2x2 - 2×2マトリクス（4象限カード）
 * data: { title, sub?, xLabel?, yLabel?, quadrants: {topLeft, topRight, bottomLeft, bottomRight}, msgBar? }
 *   quadrant: { label, body, highlight? }
 */
function matrix2x2(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', xLabel = '', yLabel = '', quadrants = {}, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const SX = 0.28, SY = 1.1, GAP = 0.12;
  const totalW = 9.44, totalH = msgBar ? 3.35 : 3.8;
  const CW = (totalW - GAP) / 2, CH = (totalH - GAP) / 2;

  const cells = [
    { key: 'topLeft',     x: SX,           y: SY },
    { key: 'topRight',    x: SX + CW + GAP, y: SY },
    { key: 'bottomLeft',  x: SX,           y: SY + CH + GAP },
    { key: 'bottomRight', x: SX + CW + GAP, y: SY + CH + GAP },
  ];

  cells.forEach(({ key, x, y }) => {
    const q = quadrants[key] || {};
    const hl = !!q.highlight;
    const hColor = hl ? C.teal : C.navy;
    const bgColor = hl ? 'EAF5F8' : C.bgLight;
    s.addShape('rect', { x, y, w: CW, h: CH, fill: { color: bgColor }, line: { color: hl ? C.teal : C.border, pt: 1 }, shadow: mkShadow() });
    s.addShape('rect', { x, y, w: CW, h: 0.38, fill: { color: hColor }, line: { color: hColor } });
    s.addText(q.label || '', { x: x + 0.12, y, w: CW - 0.24, h: 0.38, fontSize: 12, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
    s.addText(q.body || '', { x: x + 0.15, y: y + 0.44, w: CW - 0.3, h: CH - 0.54, fontSize: 12, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0 });
  });

  // 軸ラベル
  if (xLabel) s.addText(xLabel, { x: SX, y: SY + totalH + 0.06, w: totalW, h: 0.26, fontSize: 10, color: C.textMute, fontFace: C.font, align: 'center', margin: 0 });
  if (yLabel) s.addText(yLabel, { x: SX - 0.05, y: SY + totalH / 2 - 1.0, w: 2.0, h: 0.26, fontSize: 9, color: C.textMute, fontFace: C.font, align: 'center', margin: 0, rotate: 270 });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

// ─── 【グラフ系】 ─────────────────────────────────────────────────────────────

/**
 * barChartSlide - 縦棒グラフ
 * data: { title, sub?, chartData: [{name, labels, values}], colors?, insights?, insightTitle?, msgBar? }
 */
function barChartSlide(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', colors, insights, insightTitle, msgBar = '', footerLabel, footerNum } = data;
  const chartData = data.chartData || data.series || [];
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const layout = _getChartLayout(msgBar, insights);
  s.addChart(pres.charts.BAR, chartData, {
    x: layout.chartX, y: layout.chartY, w: layout.chartW, h: layout.chartH, barDir: 'col',
    chartColors: colors || [C.navy, C.teal, C.navyL, C.gold],
    chartArea: { fill: { color: C.bgLight }, roundedCorners: false },
    catAxisLabelColor: C.textMid,
    valAxisLabelColor: C.textMid,
    valGridLine: { color: C.border, size: 0.5 },
    catGridLine: { style: 'none' },
    showValue: true,
    dataLabelColor: C.textDark,
    showLegend: chartData.length > 1,
    legendPos: 'b',
  });
  if (insights && insights.length) {
    _addInsightPanel(s, layout.panelX, layout.panelY, layout.panelW, layout.panelH, insights, insightTitle || 'Key Insights', C);
  }

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

// ─── 【テキスト・統計系】 ──────────────────────────────────────────────────────

/**
 * bigStat - 大数字カード（横並び最大3枚）
 * data: { title, sub?, stats: [{value, label, sub?, detail?}], msgBar? }
 */
function bigStat(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', stats = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(stats.length, 3);
  const SX = 0.28, SY = 1.1;
  const totalW = 9.44;
  const GAP = 0.15;
  const CW = (totalW - GAP * (n - 1)) / n;
  const CH = msgBar ? 3.35 : 3.8;

  stats.slice(0, n).forEach((stat, i) => {
    const x = SX + i * (CW + GAP);
    const hasDetail = !!stat.detail;
    s.addShape('rect', { x, y: SY, w: CW, h: CH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
    // ティールアクセントバー（左端）
    s.addShape('rect', { x, y: SY, w: 0.08, h: CH, fill: { color: C.teal }, line: { color: C.teal } });
    // 大数字
    s.addText(stat.value || '', { x: x + 0.18, y: SY + 0.55, w: CW - 0.26, h: 1.6, fontSize: 48, bold: true, color: C.navy, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    // ラベル
    s.addText(stat.label || '', { x: x + 0.18, y: SY + 2.2, w: CW - 0.26, h: 0.5, fontSize: 13, color: C.textMid, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    // サブ
    if (stat.sub) {
      s.addText(stat.sub, { x: x + 0.18, y: SY + 2.72, w: CW - 0.26, h: hasDetail ? 0.30 : 0.38, fontSize: 11, italic: true, color: C.textMute, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    }
    if (hasDetail) {
      s.addText(stat.detail, {
        x: x + 0.18, y: SY + 3.02, w: CW - 0.26, h: Math.max(CH - 3.12, 0.28),
        fontSize: 10, color: C.textMid, fontFace: C.font, align: 'center', valign: 'top', margin: 0
      });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * caseStudy - 事例紹介（企業名バナー＋課題/解決/成果3ブロック）
 * data: { title, sub?, companyName, situation, solution, result, msgBar? }
 */
function caseStudy(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', companyName = '', situation = '', solution = '', result = '', msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const SY = 1.08, BW = 9.44, SX = 0.28;

  // 企業名バナー
  s.addShape('rect', { x: SX, y: SY, w: BW, h: 0.52, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText(companyName, { x: SX + 0.2, y: SY, w: BW - 0.4, h: 0.52, fontSize: 15, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });

  // 3ブロック
  const blocks = [
    { label: '課題', color: C.textMute, body: situation },
    { label: '解決策', color: C.teal, body: solution },
    { label: '成果', color: C.navy, body: result },
  ];
  const CH = msgBar ? 2.65 : 2.85;
  const blockW = (BW - 0.16) / 3;
  const blockY = SY + 0.62;

  blocks.forEach((blk, i) => {
    const x = SX + i * (blockW + 0.08);
    s.addShape('rect', { x, y: blockY, w: blockW, h: CH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
    s.addShape('rect', { x, y: blockY, w: blockW, h: 0.42, fill: { color: blk.color }, line: { color: blk.color } });
    s.addText(blk.label, { x: x + 0.12, y: blockY, w: blockW - 0.24, h: 0.42, fontSize: 13, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
    s.addText(blk.body, { x: x + 0.15, y: blockY + 0.50, w: blockW - 0.3, h: CH - 0.6, fontSize: 12, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0 });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

// ─── 【ページ固有】 ───────────────────────────────────────────────────────────

/**
 * cover - 表紙
 * data: { title, subtitle?, recipient?, company?, date?, bgImagePath? }
 */
function cover(pres, s, data, C = DEFAULT_THEME) {
  const { title, subtitle = '', recipient = '', company = '', date = '', bgImagePath } = data;

  if (bgImagePath) {
    s.background = { path: bgImagePath };
    s.addShape('rect', { x: 0, y: 0, w: SW, h: SH, fill: { color: C.navy, transparency: 25 }, line: { color: C.navy, transparency: 25 } });
  } else {
    s.background = { color: C.navy };
  }

  // 左ティールバー
  s.addShape('rect', { x: 0, y: 0, w: 0.22, h: SH, fill: { color: C.teal }, line: { color: C.teal } });

  if (subtitle) {
    // サブタイトル + タイトル（2行構成）
    s.addText(subtitle, { x: 0.5, y: 1.0, w: 8.8, h: 0.65, fontSize: 20, bold: true, color: C.teal, fontFace: C.font, margin: 0 });
    s.addText(title, { x: 0.5, y: 1.62, w: 8.8, h: 1.3, fontSize: 38, bold: true, color: C.white, fontFace: C.font, margin: 0 });
    s.addShape('rect', { x: 0.5, y: 2.98, w: 3.8, h: 0.05, fill: { color: C.teal }, line: { color: C.teal } });
  } else {
    // タイトルのみ（1行構成）
    s.addText(title, { x: 0.5, y: 1.4, w: 8.8, h: 1.6, fontSize: 44, bold: true, color: C.white, fontFace: C.font, margin: 0 });
    s.addShape('rect', { x: 0.5, y: 3.05, w: 3.8, h: 0.05, fill: { color: C.teal }, line: { color: C.teal } });
  }

  if (recipient) {
    s.addText(recipient, { x: 0.5, y: 3.18, w: 8.0, h: 0.4, fontSize: 16, color: 'CADCFF', fontFace: C.font, margin: 0 });
  }
  if (company) {
    s.addText(company + (date ? `　${date}` : ''), { x: 0.5, y: 3.65, w: 8.0, h: 0.35, fontSize: 13, color: 'AABBD8', fontFace: C.font, margin: 0 });
  }

  // フッター（表紙専用）
  s.addShape('rect', { x: 0, y: SH - 0.32, w: SW, h: 0.32, fill: { color: '0A1B32' }, line: { color: '0A1B32' } });
  s.addText(company || '', { x: 0.3, y: SH - 0.30, w: 3.0, h: 0.26, fontSize: 9, color: '8899BB', fontFace: C.font, margin: 0 });
}

/**
 * sectionDivider - セクション区切りスライド
 * data: { num, title, sub? }
 */
function sectionDivider(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', footerNum } = data;
  const num = data.num || footerNum || 1;
  s.background = { color: C.bgLight };

  // 左ネイビーパネル
  s.addShape('rect', { x: 0, y: 0, w: 3.5, h: SH, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText(String(num).padStart(2, '0'), { x: 0, y: 1.5, w: 3.5, h: 1.8, fontSize: 80, bold: true, color: 'FFFFFF', transparency: 80, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
  s.addText(`Section ${num}`, { x: 0, y: 3.5, w: 3.5, h: 0.6, fontSize: 14, color: C.teal, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });

  // 右タイトル
  s.addText(title, { x: 3.9, y: 1.8, w: 5.8, h: 1.2, fontSize: 28, bold: true, color: C.navy, fontFace: C.font, margin: 0 });
  if (sub) {
    s.addText(sub, { x: 3.9, y: 3.08, w: 5.8, h: 0.5, fontSize: 13, color: C.textMute, fontFace: C.font, margin: 0 });
  }
  s.addShape('rect', { x: 3.9, y: 1.65, w: 1.5, h: 0.06, fill: { color: C.teal }, line: { color: C.teal } });
}

/**
 * closing - クロージング（CTA）
 * data: { sideLabel?, title, sub?, items:[{text}], companyInfo?, footerLabel? }
 */
function closing(pres, s, data, C = DEFAULT_THEME) {
  const { sideLabel = 'Next\nStep', title, sub = '', items = [], companyInfo = '', footerLabel, footerNum } = data;
  s.background = { color: C.bgLight };

  // 左ネイビー帯
  s.addShape('rect', { x: 0, y: 0, w: 2.4, h: SH, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText(sideLabel, { x: 0, y: 1.8, w: 2.4, h: 1.2, fontSize: 30, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });

  // 右コンテンツ
  s.addText(title, { x: 2.7, y: 1.0, w: 7.0, h: 0.75, fontSize: 30, bold: true, color: C.navy, fontFace: C.font, margin: 0 });
  if (sub) {
    s.addText(sub, { x: 2.7, y: 1.75, w: 7.0, h: 0.35, fontSize: 13, color: C.textMute, fontFace: C.font, margin: 0 });
  }
  s.addShape('rect', { x: 2.7, y: 2.18, w: 5.0, h: 0.04, fill: { color: C.teal }, line: { color: C.teal } });

  items.forEach((item, i) => {
    const cy = 2.35 + i * 0.58;
    s.addShape('ellipse', { x: 2.7, y: cy + 0.06, w: 0.28, h: 0.28, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText(item.text, { x: 3.1, y: cy, w: 6.6, h: 0.42, fontSize: 12, color: C.textDark, fontFace: C.font, valign: 'middle', margin: 0 });
  });

  if (companyInfo) {
    s.addShape('rect', { x: 2.7, y: 4.4, w: 7.0, h: 0.85, fill: { color: 'E2E8F2' }, line: { color: C.border, pt: 1 } });
    s.addText(companyInfo, { x: 2.88, y: 4.44, w: 6.64, h: 0.77, fontSize: 10, color: C.textMid, fontFace: C.font, valign: 'middle', margin: 0 });
  }

  addFooter(s, footerNum, '', footerLabel, C);
}

// ─── 【追加パターン群】 ───────────────────────────────────────────────────────

/**
 * tableOfContents - 目次
 * data: { title, items: [{num, label, sub?}] }
 */
function tableOfContents(pres, s, data, C = DEFAULT_THEME) {
  const { title = '目次', items = [], footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, '', C);

  const SX = 0.28, SY = 1.02, GAP = 0.08;
  const maxItems = Math.min(items.length, 7);
  const itemH = Math.min(0.72, (5.2 - SY - GAP * (maxItems - 1)) / maxItems);

  items.slice(0, maxItems).forEach((item, i) => {
    const y = SY + i * (itemH + GAP);
    const numW = 0.62;
    s.addShape('rect', { x: SX, y, w: numW, h: itemH, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(String(item.num || i + 1).padStart(2, '0'), { x: SX, y, w: numW, h: itemH, fontSize: 16, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    s.addShape('rect', { x: SX + numW, y, w: 9.44 - numW, h: itemH, fill: { color: i % 2 === 0 ? C.bgLight : C.white }, line: { color: C.border, pt: 0.5 } });
    s.addText(item.label, { x: SX + numW + 0.2, y: y + 0.06, w: 8.5, h: 0.42, fontSize: 14, bold: true, color: C.navy, fontFace: C.font, valign: 'middle', margin: 0 });
    if (item.sub) {
      s.addText(item.sub, { x: SX + numW + 0.2, y: y + 0.42, w: 8.5, h: 0.24, fontSize: 10, color: C.textMute, fontFace: C.font, valign: 'middle', margin: 0 });
    }
  });

  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * quoteSlide - 引用・メッセージ
 * data: { title?, quote, author?, role?, src? }
 */
function quoteSlide(pres, s, data, C = DEFAULT_THEME) {
  const { title = '', quote, author = '', role = '', src = '', footerLabel, footerNum } = data;
  s.background = { color: C.navy };

  s.addShape('rect', { x: 0, y: 0, w: 0.22, h: SH, fill: { color: C.teal }, line: { color: C.teal } });

  const qY = title ? 1.3 : 1.0;
  if (title) {
    s.addText(title, { x: 0.5, y: 0.55, w: 9.0, h: 0.55, fontSize: 14, color: C.teal, fontFace: C.font, margin: 0 });
  }
  s.addText('\u201c', { x: 0.42, y: qY - 0.5, w: 1.0, h: 0.9, fontSize: 80, bold: true, color: C.teal, fontFace: C.font, align: 'left', margin: 0 });
  s.addText(quote, { x: 0.5, y: qY, w: 9.0, h: 2.8, fontSize: 22, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
  s.addShape('rect', { x: 0.5, y: qY + 2.9, w: 2.5, h: 0.04, fill: { color: C.teal }, line: { color: C.teal } });
  if (author) {
    s.addText(author + (role ? `　${role}` : ''), { x: 0.5, y: qY + 3.0, w: 9.0, h: 0.36, fontSize: 13, color: 'AABBD8', fontFace: C.font, margin: 0 });
  }
  if (src) {
    s.addText(`出典：${src}`, { x: 0.5, y: SH - 0.55, w: 9.0, h: 0.28, fontSize: 9, italic: true, color: '667799', fontFace: C.font, margin: 0 });
  }
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * ranking - ランキング表示
 * data: { title, sub?, items: [{rank?, label, value?, body?}], msgBar? }
 */
function ranking(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', items = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(items.length, 5);
  const SX = 0.28, SY = 1.1;
  const itemH = msgBar ? (3.35 / n) - 0.08 : (4.0 / n) - 0.08;
  const rankColors = [C.gold, 'A8A8A8', 'C47A3C', C.teal, C.navyL];

  items.slice(0, n).forEach((item, i) => {
    const y = SY + i * (itemH + 0.08);
    const rc = rankColors[i] || C.navyL;
    s.addShape('rect', { x: SX, y, w: 9.44, h: itemH, fill: { color: C.bgLight }, line: { color: C.border, pt: 0.5 } });
    s.addShape('rect', { x: SX, y, w: 0.6, h: itemH, fill: { color: rc }, line: { color: rc } });
    s.addText(String(item.rank || i + 1), { x: SX, y, w: 0.6, h: itemH, fontSize: 14, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    const hasBody = !!item.body;
    const labelH = hasBody ? Math.min(itemH * 0.52, 0.40) : itemH - 0.12;
    const labelValign = hasBody ? 'bottom' : 'middle';
    s.addText(item.label, { x: SX + 0.72, y: y + 0.05, w: 5.5, h: labelH, fontSize: 13, bold: true, color: C.navy, fontFace: C.font, valign: labelValign, margin: 0 });
    if (item.value) {
      s.addText(item.value, { x: SX + 6.5, y: y + 0.06, w: 3.1, h: itemH - 0.12, fontSize: 18, bold: true, color: rc, fontFace: C.font, align: 'right', valign: 'middle', margin: 0 });
    }
    if (item.body) {
      s.addText(item.body, { x: SX + 0.72, y: y + labelH + 0.07, w: 5.5, h: itemH - labelH - 0.14, fontSize: 10, color: C.textMute, fontFace: C.font, valign: 'top', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * pyramid - ピラミッド（下から上へ積み上げ）
 * data: { title, sub?, layers: [{label, body?, color?}]（下から順）, msgBar? }
 */
function pyramid(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', msgBar = '', footerLabel, footerNum } = data;
  const layers = (data.layers || data.levels || []).map(l => ({ ...l, body: l.body || l.desc }));
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(layers.length, 5);
  const SY = msgBar ? 1.1 : 1.05;
  const totalH = msgBar ? 3.35 : 3.9;
  const layerH = totalH / n;
  const baseW = 9.0, SX = 0.5;
  const colors = [C.navy, C.teal, C.navyL, '7BB8C8', 'AACCD8'];

  layers.slice(0, n).forEach((layer, i) => {
    // i=0が最上層（最狭）、i=n-1が最下層（最広）← 正ピラミッド形
    const ratio = (i + 1) / n;
    const w = baseW * ratio;
    const x = SX + (baseW - w) / 2;
    const y = SY + i * layerH;
    const fc = layer.color || colors[i % colors.length];
    s.addShape('rect', { x, y, w, h: layerH - 0.06, fill: { color: fc }, line: { color: fc } });
    s.addText(layer.label, { x, y, w, h: layerH * 0.55, fontSize: 13, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    if (layer.body) {
      s.addText(layer.body, { x, y: y + layerH * 0.55, w, h: layerH * 0.4, fontSize: 10, color: C.white, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * invertedPyramid - 逆ピラミッド（上から下へ先細り）
 * data: { title, sub?, layers: [{label, body?, color?}]（上から順）, msgBar? }
 */
function invertedPyramid(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', msgBar = '', footerLabel, footerNum } = data;
  const layers = (data.layers || data.levels || []).map(l => ({ ...l, body: l.body || l.desc }));
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(layers.length, 5);
  const SY = msgBar ? 1.1 : 1.05;
  const totalH = msgBar ? 3.35 : 3.9;
  const layerH = totalH / n;
  const baseW = 9.0, SX = 0.5;
  const colors = [C.navy, C.teal, C.navyL, '7BB8C8', 'AACCD8'];

  layers.slice(0, n).forEach((layer, i) => {
    const ratio = (n - i) / n;
    const w = baseW * ratio;
    const x = SX + (baseW - w) / 2;
    const y = SY + i * layerH;
    const fc = layer.color || colors[i % colors.length];
    s.addShape('rect', { x, y, w, h: layerH - 0.06, fill: { color: fc }, line: { color: fc } });
    s.addText(layer.label, { x, y, w, h: layerH * 0.55, fontSize: 13, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    if (layer.body) {
      s.addText(layer.body, { x, y: y + layerH * 0.55, w, h: layerH * 0.4, fontSize: 10, color: C.white, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * staircase - 階段状パターン（左下→右上の上昇ステップ）
 * data: { title, sub?, steps: [{label, body?}], msgBar? }
 */
function staircase(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', steps = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(steps.length, 5);
  const SX = 0.28, SY = msgBar ? 1.1 : 1.05;
  const totalW = 9.44, totalH = msgBar ? 3.35 : 3.9;
  const stepW = totalW / n;
  const colors = [C.navyL, '4A8FA8', C.teal, '1A9070', '0D6A50'];

  steps.slice(0, n).forEach((step, i) => {
    const x = SX + i * stepW;
    const blockH = totalH * (i + 1) / n;
    const y = SY + totalH - blockH;
    const fc = step.color || colors[i % colors.length];
    s.addShape('rect', { x, y, w: stepW - 0.08, h: blockH, fill: { color: fc }, line: { color: fc }, shadow: mkShadow() });
    s.addText(step.label, { x, y: y + 0.15, w: stepW - 0.08, h: 0.52, fontSize: 12, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    if (step.body && blockH > 0.9) {
      s.addText(step.body, { x, y: y + 0.72, w: stepW - 0.08, h: Math.max(blockH - 0.8, 0.3), fontSize: 10, color: C.white, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * cyclicCircle - 円形サイクル（3〜5要素の循環）
 * data: { title, sub?, steps: [{label, body?}], msgBar? }
 */
function cyclicCircle(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', steps = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(steps.length, 6);
  const cx = 5.0, cy = msgBar ? 2.85 : 3.05;
  const R = msgBar ? 1.4 : 1.6;
  const nodeR = 0.55;

  steps.slice(0, n).forEach((step, i) => {
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    const nx = cx + R * Math.cos(angle);
    const ny = cy + R * Math.sin(angle);
    const hl = step.highlight;
    const fc = hl ? C.teal : C.navy;

    s.addShape('ellipse', { x: nx - nodeR, y: ny - nodeR, w: nodeR * 2, h: nodeR * 2, fill: { color: fc }, line: { color: fc }, shadow: mkShadow() });
    s.addText(String(i + 1), { x: nx - nodeR, y: ny - nodeR, w: nodeR * 2, h: nodeR * 0.9, fontSize: 14, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    s.addText(step.label, { x: nx - nodeR, y: ny - nodeR + nodeR * 0.9, w: nodeR * 2, h: nodeR * 1.1, fontSize: 9, color: C.white, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });

    // 矢印（次のノードへ）
    const nextAngle = (2 * Math.PI * (i + 1) / n) - Math.PI / 2;
    const mx = cx + R * Math.cos(angle + Math.PI / n);
    const my = cy + R * Math.sin(angle + Math.PI / n);
    s.addText('→', { x: mx - 0.25, y: my - 0.2, w: 0.5, h: 0.4, fontSize: 14, bold: true, color: C.teal, fontFace: C.font, align: 'center', margin: 0 });

    // 外側ラベル
    if (step.body) {
      const lx = cx + (R + nodeR + 0.15) * Math.cos(angle);
      const ly = cy + (R + nodeR + 0.15) * Math.sin(angle);
      s.addText(step.body, { x: lx - 0.9, y: ly - 0.22, w: 1.8, h: 0.44, fontSize: 9, color: C.textMid, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * cyclicSquare - 四角形サイクル（4要素の循環）
 * data: { title, sub?, steps: [{label, body?}], msgBar? }
 */
function cyclicSquare(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', steps = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(steps.length, 4);
  const CW = 3.4, CH = 1.4, GAP = 0.5;
  const SX = 0.28, SY = msgBar ? 1.12 : 1.1;
  const positions = [
    { x: SX,           y: SY },
    { x: SX + CW + GAP, y: SY },
    { x: SX + CW + GAP, y: SY + CH + GAP },
    { x: SX,           y: SY + CH + GAP },
  ];
  const arrows = [
    { x: SX + CW + 0.05, y: SY + CH / 2 - 0.18, text: '→' },
    { x: SX + CW + GAP + CW / 2 - 0.18, y: SY + CH + 0.05, text: '↓' },
    { x: SX + CW + 0.05, y: SY + CH + GAP + CH / 2 - 0.18, text: '←' },
    { x: SX + CW / 2 - 0.18, y: SY + CH + 0.05, text: '↑' },
  ];

  steps.slice(0, n).forEach((step, i) => {
    const pos = positions[i];
    const hl = step.highlight;
    const fc = hl ? C.teal : C.navy;
    s.addShape('rect', { x: pos.x, y: pos.y, w: CW, h: CH, fill: { color: fc }, line: { color: fc }, shadow: mkShadow() });
    s.addText(step.label, { x: pos.x, y: pos.y + 0.1, w: CW, h: 0.52, fontSize: 13, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    if (step.body) {
      s.addText(step.body, { x: pos.x + 0.1, y: pos.y + 0.68, w: CW - 0.2, h: CH - 0.74, fontSize: 10, color: C.white, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
    if (i < n) {
      const arr = arrows[i];
      s.addText(arr.text, { x: arr.x, y: arr.y, w: 0.36, h: 0.36, fontSize: 18, bold: true, color: C.teal, fontFace: C.font, align: 'center', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * vennDiagram - ベン図（2〜3要素の重なり）
 * data: { title, sub?, circles: [{label, body?, color?}], overlap?: {label, body?}, msgBar? }
 */
function vennDiagram(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', circles = [], overlap = null, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(circles.length, 3);
  const cy = msgBar ? 2.72 : 2.9;
  const r = 1.35;
  const colors = [C.navy, C.teal, C.navyL];

  if (n === 2) {
    const positions = [{ x: 3.0, y: cy }, { x: 5.5, y: cy }];
    circles.slice(0, 2).forEach((c, i) => {
      const fc = c.color || colors[i];
      s.addShape('ellipse', { x: positions[i].x - r, y: positions[i].y - r, w: r * 2, h: r * 2, fill: { color: fc, transparency: 30 }, line: { color: fc, pt: 2 } });
      const lx = i === 0 ? positions[i].x - r - 0.1 : positions[i].x + r * 0.3;
      s.addText(c.label, { x: lx, y: positions[i].y - 0.28, w: 1.5, h: 0.56, fontSize: 12, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
      if (c.body) {
        s.addText(c.body, { x: lx, y: positions[i].y + 0.28, w: 1.5, h: 0.5, fontSize: 9, color: C.white, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
      }
    });
    if (overlap) {
      s.addText(overlap.label || '', { x: 4.1, y: cy - 0.28, w: 1.4, h: 0.56, fontSize: 11, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
      if (overlap.body) s.addText(overlap.body, { x: 4.1, y: cy + 0.28, w: 1.4, h: 0.4, fontSize: 9, color: C.textMid, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
  } else if (n === 3) {
    const positions = [
      { x: 5.0, y: cy - 1.0 },
      { x: 3.7, y: cy + 0.7 },
      { x: 6.3, y: cy + 0.7 },
    ];
    circles.slice(0, 3).forEach((c, i) => {
      const fc = c.color || colors[i];
      s.addShape('ellipse', { x: positions[i].x - r, y: positions[i].y - r, w: r * 2, h: r * 2, fill: { color: fc, transparency: 45 }, line: { color: fc, pt: 2 } });
      s.addText(c.label, { x: positions[i].x - 0.8, y: positions[i].y - 0.22, w: 1.6, h: 0.44, fontSize: 11, bold: true, color: C.navy, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    });
    if (overlap) {
      s.addText(overlap.label || '', { x: 4.35, y: cy - 0.22, w: 1.3, h: 0.44, fontSize: 10, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    }
  }

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * treeChart - ツリー図（階層構造）
 * data: { title, sub?, root: {label, children: [{label, children?:[{label}]}]}, msgBar? }
 */
function treeChart(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', root, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const rootX = 0.28, rootY = msgBar ? 1.6 : 1.7;
  const rootW = 2.2, rootH = 0.6;
  const level2X = 3.0, level2W = 2.0, level2H = 0.55;
  const level3X = 5.7, level3W = 3.8, level3H = 0.48;

  if (!root) { addFooter(s, footerNum, '', footerLabel, C); return; }

  const children = root.children || [];
  const totalChildH = children.length * (level2H + 0.15);
  const rootCY = rootY + totalChildH / 2;

  // ルート
  s.addShape('rect', { x: rootX, y: rootCY - rootH / 2, w: rootW, h: rootH, fill: { color: C.navy }, line: { color: C.navy }, shadow: mkShadow() });
  s.addText(root.label, { x: rootX, y: rootCY - rootH / 2, w: rootW, h: rootH, fontSize: 13, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });

  children.forEach((child, ci) => {
    const grandchildren = child.children || [];
    const childY = rootY + ci * (level2H + 0.15);
    const childCY = childY + level2H / 2;

    // 接続線
    s.addShape('line', { x: rootX + rootW, y: rootCY, w: level2X - rootX - rootW, h: 0, line: { color: C.border, pt: 1.5 } });
    s.addShape('line', { x: level2X - 0.08, y: rootCY, w: 0, h: childCY - rootCY, line: { color: C.border, pt: 1.5 } });
    s.addShape('line', { x: level2X - 0.08, y: childCY, w: 0.08, h: 0, line: { color: C.border, pt: 1.5 } });

    // L2ノード
    s.addShape('rect', { x: level2X, y: childY, w: level2W, h: level2H, fill: { color: C.teal }, line: { color: C.teal }, shadow: mkShadow() });
    s.addText(child.label, { x: level2X, y: childY, w: level2W, h: level2H, fontSize: 11, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });

    // L3ノード
    if (grandchildren.length > 0) {
      const gcH = level3H;
      const totalGcH = grandchildren.length * (gcH + 0.1);
      const gcStartY = childY + level2H / 2 - totalGcH / 2;

      grandchildren.forEach((gc, gi) => {
        const gcY = gcStartY + gi * (gcH + 0.1);
        const gcCY = gcY + gcH / 2;
        s.addShape('line', { x: level2X + level2W, y: childCY, w: level3X - level2X - level2W, h: 0, line: { color: C.border, pt: 1 } });
        s.addShape('line', { x: level3X - 0.06, y: childCY, w: 0, h: gcCY - childCY, line: { color: C.border, pt: 1 } });
        s.addShape('line', { x: level3X - 0.06, y: gcCY, w: 0.06, h: 0, line: { color: C.border, pt: 1 } });
        s.addShape('rect', { x: level3X, y: gcY, w: level3W, h: gcH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 } });
        s.addShape('rect', { x: level3X, y: gcY, w: 0.06, h: gcH, fill: { color: C.navyL }, line: { color: C.navyL } });
        s.addText(gc.label, { x: level3X + 0.14, y: gcY, w: level3W - 0.2, h: gcH, fontSize: 10, color: C.textDark, fontFace: C.font, valign: 'middle', margin: 0 });
      });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * timeline - タイムライン・スケジュール
 * data: { title, sub?, items: [{date, label, body?, highlight?}], msgBar? }
 */
function timeline(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', items = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(items.length, 6);
  const SX = 0.28, lineY = msgBar ? 2.7 : 2.9;
  const totalW = 9.44;
  const step = totalW / n;
  const bodyH = 0.28;
  const bodyGap = 0.12;

  // 基準線
  s.addShape('rect', { x: SX, y: lineY - 0.04, w: totalW, h: 0.08, fill: { color: C.border }, line: { color: C.border } });

  items.slice(0, n).forEach((item, i) => {
    const cx = SX + step * i + step / 2;
    const hl = !!item.highlight;
    const dotC = hl ? C.teal : C.navy;
    const dotR = hl ? 0.22 : 0.17;
    const tw = step - 0.1, tx = cx - step / 2 + 0.05;

    // ドット
    s.addShape('ellipse', { x: cx - dotR, y: lineY - dotR, w: dotR * 2, h: dotR * 2, fill: { color: dotC }, line: { color: dotC } });

    // 上部（偶数）・下部（奇数）で交互配置
    const above = i % 2 === 0;
    if (above) {
      // 上側: date → label → (body) → ドット
      s.addText(item.date, { x: tx, y: lineY - 1.45, w: tw, h: 0.25, fontSize: 10, bold: true, color: dotC, fontFace: C.font, align: 'center', margin: 0 });
      s.addText(item.label, { x: tx, y: lineY - 1.2, w: tw, h: 0.3, fontSize: 12, bold: true, color: C.navy, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
      if (item.body) {
        s.addText(item.body, { x: tx, y: lineY - 0.88, w: tw, h: 0.25, fontSize: 9, color: C.textMute, fontFace: C.font, align: 'center', margin: 0 });
      }
    } else {
      // 下側: ドット → (body) → date → label
      if (item.body) {
        s.addText(item.body, { x: tx, y: lineY + 0.3, w: tw, h: 0.25, fontSize: 9, color: C.textMute, fontFace: C.font, align: 'center', margin: 0 });
      }
      s.addText(item.date, { x: tx, y: lineY + 0.55, w: tw, h: 0.25, fontSize: 10, bold: true, color: dotC, fontFace: C.font, align: 'center', margin: 0 });
      s.addText(item.label, { x: tx, y: lineY + 0.8, w: tw, h: 0.3, fontSize: 12, bold: true, color: C.navy, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * scaleComparison - スケール比較（サイズの視覚差で規模を表現）
 * data: { title, sub?, items: [{label, value, unit?, body?}], msgBar? }
 */
function scaleComparison(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', items = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(items.length, 4);
  const maxVal = Math.max(...items.slice(0, n).map(it => parseFloat(it.value) || 1));
  const SX = 0.28, SY = msgBar ? 1.1 : 1.05;
  const totalH = msgBar ? 3.35 : 3.9;
  const colW = 9.44 / n;

  items.slice(0, n).forEach((item, i) => {
    const val = parseFloat(item.value) || 0;
    const ratio = val / maxVal;
    const barH = totalH * 0.65 * ratio;
    const x = SX + i * colW;
    const barY = SY + totalH * 0.7 - barH;
    const fc = i === 0 ? C.navy : i === 1 ? C.teal : i === 2 ? C.navyL : C.gold;

    s.addShape('rect', { x: x + colW * 0.15, y: barY, w: colW * 0.7, h: barH, fill: { color: fc }, line: { color: fc }, shadow: mkShadow() });
    s.addText(`${item.value}${item.unit || ''}`, { x, y: barY - 0.5, w: colW, h: 0.48, fontSize: 18, bold: true, color: fc, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    s.addText(item.label, { x, y: SY + totalH * 0.72, w: colW, h: 0.4, fontSize: 12, bold: true, color: C.navy, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    if (item.body) {
      s.addText(item.body, { x, y: SY + totalH * 0.72 + 0.42, w: colW, h: 0.5, fontSize: 10, color: C.textMute, fontFace: C.font, align: 'center', valign: 'top', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * itemComparison - アイテム比較（機能・特徴の有無を比較）
 * data: { title, sub?, items: [{name, features:[{text, has?}]}], featureLabels?: string[], msgBar? }
 */
function itemComparison(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', msgBar = '', footerLabel, footerNum } = data;
  // {headers, rows:[{feature, vals}]} → {items, featureLabels} に変換
  let items = data.items || [];
  let featureLabels = data.featureLabels || [];
  if (data.rows && data.headers) {
    featureLabels = data.rows.map(r => r.feature);
    items = data.headers.map((h, hi) => ({
      name: h,
      features: data.rows.map(r => ({ text: r.vals[hi], has: r.vals[hi] !== '—' && r.vals[hi] !== '-' })),
    }));
  }
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(items.length, 3);
  const SX = 0.28, SY = 1.1;
  const labelColW = 2.8;
  const dataColW = (9.44 - labelColW) / n;
  const rowH = msgBar ? (3.35 / (featureLabels.length + 1)) : (3.9 / (featureLabels.length + 1));

  // ヘッダー行
  s.addShape('rect', { x: SX, y: SY, w: labelColW, h: rowH, fill: { color: C.bgAlt }, line: { color: C.border, pt: 0.5 } });
  items.slice(0, n).forEach((item, i) => {
    const x = SX + labelColW + i * dataColW;
    const fc = i === 0 ? C.navy : i === 1 ? C.teal : C.navyL;
    s.addShape('rect', { x, y: SY, w: dataColW, h: rowH, fill: { color: fc }, line: { color: fc } });
    s.addText(item.name, { x, y: SY, w: dataColW, h: rowH, fontSize: 12, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
  });

  // データ行
  featureLabels.forEach((fl, ri) => {
    const y = SY + (ri + 1) * rowH;
    s.addShape('rect', { x: SX, y, w: labelColW, h: rowH, fill: { color: ri % 2 === 0 ? C.bgLight : C.white }, line: { color: C.border, pt: 0.5 } });
    s.addText(fl, { x: SX + 0.12, y, w: labelColW - 0.2, h: rowH, fontSize: 11, bold: true, color: C.textDark, fontFace: C.font, valign: 'middle', margin: 0 });
    items.slice(0, n).forEach((item, i) => {
      const x = SX + labelColW + i * dataColW;
      const feat = item.features[ri];
      const has = feat ? (feat.has !== false) : false;
      const txt = feat ? (typeof feat === 'string' ? feat : (feat.text || (has ? '◎' : '—'))) : '—';
      const fc = i === 0 ? C.navy : i === 1 ? C.teal : C.navyL;
      s.addShape('rect', { x, y, w: dataColW, h: rowH, fill: { color: ri % 2 === 0 ? C.bgLight : C.white }, line: { color: C.border, pt: 0.5 } });
      s.addText(txt, { x, y, w: dataColW, h: rowH, fontSize: 12, bold: has, color: has ? fc : C.textMute, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * qaSlide - Q&A形式
 * data: { title, sub?, items: [{q, a}], msgBar? }
 */
function qaSlide(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', msgBar = '', footerLabel, footerNum } = data;
  const items = data.items || data.pairs || [];
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(items.length, 4);
  const SX = 0.28, SY = 1.1;
  const totalH = msgBar ? 3.35 : 3.9;
  const itemH = (totalH / n) - 0.1;

  items.slice(0, n).forEach((item, i) => {
    const y = SY + i * (itemH + 0.1);
    s.addShape('rect', { x: SX, y, w: 9.44, h: itemH, fill: { color: C.bgLight }, line: { color: C.border, pt: 0.5 } });
    // Q
    s.addShape('rect', { x: SX, y, w: 0.48, h: itemH * 0.48, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText('Q', { x: SX, y, w: 0.48, h: itemH * 0.48, fontSize: 14, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    s.addText(item.q, { x: SX + 0.58, y: y + 0.04, w: 8.7, h: itemH * 0.44, fontSize: 12, bold: true, color: C.navy, fontFace: C.font, valign: 'middle', margin: 0 });
    // A
    s.addShape('rect', { x: SX, y: y + itemH * 0.52, w: 0.48, h: itemH * 0.44, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText('A', { x: SX, y: y + itemH * 0.52, w: 0.48, h: itemH * 0.44, fontSize: 14, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    s.addText(item.a, { x: SX + 0.58, y: y + itemH * 0.52 + 0.04, w: 8.7, h: itemH * 0.4, fontSize: 11, color: C.textMid, fontFace: C.font, valign: 'middle', margin: 0 });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * companyProfile - 企業プロフィール
 * data: { title?, companyName, tagline?, facts:[{label, value}], note? }
 */
function companyProfile(pres, s, data, C = DEFAULT_THEME) {
  const { companyName, tagline = '', facts = [], note = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };

  // 左ネイビーパネル
  s.addShape('rect', { x: 0, y: 0, w: 3.8, h: SH, fill: { color: C.navy }, line: { color: C.navy } });
  s.addShape('rect', { x: 0, y: 0, w: 0.18, h: SH, fill: { color: C.teal }, line: { color: C.teal } });
  s.addText(companyName, { x: 0.28, y: 1.6, w: 3.3, h: 1.2, fontSize: 22, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
  if (tagline) {
    s.addText(tagline, { x: 0.28, y: 2.9, w: 3.3, h: 0.6, fontSize: 11, color: C.teal, fontFace: C.font, valign: 'top', margin: 0 });
  }
  s.addShape('rect', { x: 0.28, y: 1.45, w: 1.5, h: 0.06, fill: { color: C.teal }, line: { color: C.teal } });

  // 右：KVP
  const SX = 4.1, SY = 0.9;
  const factH = (SH - SY - 0.5) / Math.min(facts.length, 5);
  facts.slice(0, 5).forEach((fact, i) => {
    const y = SY + i * factH;
    s.addShape('rect', { x: SX, y: y + 0.05, w: 5.6, h: factH - 0.1, fill: { color: C.bgLight }, line: { color: C.border, pt: 0.5 } });
    s.addShape('rect', { x: SX, y: y + 0.05, w: 0.06, h: factH - 0.1, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText(fact.label, { x: SX + 0.16, y: y + 0.08, w: 2.2, h: factH - 0.22, fontSize: 11, color: C.textMute, fontFace: C.font, valign: 'middle', margin: 0 });
    s.addText(fact.value, { x: SX + 2.5, y: y + 0.08, w: 3.0, h: factH - 0.22, fontSize: 13, bold: true, color: C.navy, fontFace: C.font, valign: 'middle', margin: 0 });
  });

  if (note) {
    s.addText(note, { x: SX, y: SH - 0.4, w: 5.6, h: 0.28, fontSize: 9, italic: true, color: C.textMute, fontFace: C.font, margin: 0 });
  }
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * memberGrid - メンバー紹介（最大4人）
 * data: { title, sub?, members: [{name, role, bio?}], footerLabel? }
 */
function memberGrid(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', members = [], footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = Math.min(members.length, 4);
  const cols = n <= 2 ? n : 2;
  const rows = n <= 2 ? 1 : 2;
  const cardH = rows === 1 ? 3.6 : 1.75;
  const SX = 0.28, SY = 1.1, GAP = 0.12;
  const contentW = 9.44;
  const colW = cols > 0 ? (contentW - GAP * (cols - 1)) / cols : contentW;

  members.slice(0, n).forEach((m, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = SX + col * (colW + GAP);
    const y = SY + row * (cardH + GAP);

    s.addShape('rect', { x, y, w: colW, h: cardH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
    s.addShape('rect', { x, y, w: colW, h: 0.42, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(m.name, { x: x + 0.12, y: y + 0.02, w: colW - 0.24, h: 0.38, fontSize: 13, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
    s.addText(m.role || '', { x: x + 0.12, y: y + 0.46, w: colW - 0.24, h: 0.34, fontSize: 11, bold: true, color: C.teal, fontFace: C.font, valign: 'middle', margin: 0 });
    if (m.bio) {
      s.addText(m.bio, { x: x + 0.15, y: y + 0.84, w: colW - 0.3, h: cardH - 0.96, fontSize: 10, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0 });
    }
  });

  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * logoGrid - ロゴ配列（クライアント・パートナー一覧）
 * data: { title, sub?, logos: [{name, path?}], note? }
 */
function logoGrid(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', logos = [], note = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const n = logos.length;
  const cols = n <= 3 ? n : n <= 6 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const cellW = 9.44 / cols;
  const cellH = (note ? 3.2 : 3.7) / rows;
  const SX = 0.28, SY = 1.1;

  logos.forEach((logo, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = SX + col * cellW;
    const y = SY + row * cellH;

    s.addShape('rect', { x: x + 0.1, y: y + 0.1, w: cellW - 0.2, h: cellH - 0.2, fill: { color: C.bgLight }, line: { color: C.border, pt: 0.5 } });
    if (logo.path) {
      s.addImage({ path: logo.path, x: x + cellW * 0.1, y: y + cellH * 0.15, w: cellW * 0.8, h: cellH * 0.7 });
    } else {
      s.addText(logo.name, { x: x + 0.1, y: y + 0.1, w: cellW - 0.2, h: cellH - 0.2, fontSize: 13, bold: true, color: C.navyL, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    }
  });

  if (note) {
    s.addText(note, { x: SX, y: SY + rows * cellH + 0.1, w: 9.44, h: 0.3, fontSize: 10, italic: true, color: C.textMute, fontFace: C.font, align: 'center', margin: 0 });
  }
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * containment - 包含・相互関係（入れ子構造）
 * data: { title, sub?, outer: {label, color?}, inner: [{label, body?}], msgBar? }
 */
function containment(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', outer, inner = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const SX = 0.28, SY = 1.1;
  const outerW = 9.44, outerH = msgBar ? 3.35 : 3.8;
  const outerC = (outer && outer.color) ? outer.color : C.navy;

  s.addShape('rect', { x: SX, y: SY, w: outerW, h: outerH, fill: { color: outerC, transparency: 85 }, line: { color: outerC, pt: 2 } });
  if (outer && outer.label) {
    s.addText(outer.label, { x: SX + 0.15, y: SY + 0.1, w: outerW - 0.3, h: 0.38, fontSize: 12, bold: true, color: outerC, fontFace: C.font, margin: 0 });
  }

  const n = Math.min(inner.length, 3);
  const innerGAP = 0.18;
  const innerW = (outerW - innerGAP * (n + 1)) / n;
  const innerH = outerH - 0.72;
  const innerSX = SX + innerGAP;
  const innerSY = SY + 0.54;

  inner.slice(0, n).forEach((item, i) => {
    const x = innerSX + i * (innerW + innerGAP);
    const fc = i === 0 ? C.navy : i === 1 ? C.teal : C.navyL;
    s.addShape('rect', { x, y: innerSY, w: innerW, h: innerH, fill: { color: fc }, line: { color: fc }, shadow: mkShadow() });
    s.addText(item.label, { x, y: innerSY + 0.1, w: innerW, h: 0.52, fontSize: 12, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0 });
    if (item.body) {
      s.addText(item.body, { x: x + 0.12, y: innerSY + 0.68, w: innerW - 0.24, h: innerH - 0.78, fontSize: 10, color: C.white, fontFace: C.font, valign: 'top', margin: 0 });
    }
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * lineChartSlide - 折れ線グラフ
 * data: { title, sub?, chartData: [{name, labels, values}], insights?, insightTitle?, msgBar? }
 */
function lineChartSlide(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', colors, insights, insightTitle, msgBar = '', footerLabel, footerNum } = data;
  const chartData = data.chartData || data.series || [];
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const layout = _getChartLayout(msgBar, insights);
  s.addChart(pres.charts.LINE, chartData, {
    x: layout.chartX, y: layout.chartY, w: layout.chartW, h: layout.chartH,
    chartColors: colors || [C.navy, C.teal, C.navyL, C.gold],
    chartArea: { fill: { color: C.bgLight }, roundedCorners: false },
    catAxisLabelColor: C.textMid,
    valAxisLabelColor: C.textMid,
    valGridLine: { color: C.border, size: 0.5 },
    catGridLine: { style: 'none' },
    lineSmooth: false,
    lineSize: 3,
    showValue: false,
    showLegend: chartData.length > 1,
    legendPos: 'b',
  });
  if (insights && insights.length) {
    _addInsightPanel(s, layout.panelX, layout.panelY, layout.panelW, layout.panelH, insights, insightTitle || 'Key Insights', C);
  }

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * hBarChartSlide - 横棒グラフ
 * data: { title, sub?, chartData: [{name, labels, values}], insights?, insightTitle?, msgBar? }
 */
function hBarChartSlide(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', colors, insights, insightTitle, msgBar = '', footerLabel, footerNum } = data;
  const chartData = data.chartData || data.series || [];
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const layout = _getChartLayout(msgBar, insights);
  s.addChart(pres.charts.BAR, chartData, {
    x: layout.chartX, y: layout.chartY, w: layout.chartW, h: layout.chartH, barDir: 'bar',
    chartColors: colors || [C.navy, C.teal, C.navyL, C.gold],
    chartArea: { fill: { color: C.bgLight }, roundedCorners: false },
    catAxisLabelColor: C.textMid,
    valAxisLabelColor: C.textMid,
    valGridLine: { color: C.border, size: 0.5 },
    catGridLine: { style: 'none' },
    showValue: true,
    dataLabelColor: C.textDark,
    showLegend: chartData.length > 1,
    legendPos: 'b',
  });
  if (insights && insights.length) {
    _addInsightPanel(s, layout.panelX, layout.panelY, layout.panelW, layout.panelH, insights, insightTitle || 'Key Insights', C);
  }

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * pieChartSlide - 円グラフ
 * data: { title, sub?, chartData: [{name, labels, values}], insights?, insightTitle?, msgBar? }
 */
function pieChartSlide(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', colors, insights, insightTitle, msgBar = '', footerLabel, footerNum } = data;
  const chartData = data.chartData || data.series || [];
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const layout = _getChartLayout(msgBar, insights);
  const hasInsights = !!(insights && insights.length);
  s.addChart(pres.charts.PIE, chartData, {
    x: hasInsights ? layout.chartX : 1.5, y: 1.08, w: hasInsights ? layout.chartW : 7.0, h: layout.chartH,
    chartColors: colors || [C.navy, C.teal, C.navyL, C.gold, 'A8C8D8'],
    chartArea: { fill: { color: C.white }, roundedCorners: false },
    showPercent: true,
    showLegend: true,
    legendPos: hasInsights ? 'b' : 'r',
    dataLabelColor: C.white,
  });
  if (hasInsights) {
    _addInsightPanel(s, layout.panelX, layout.panelY, layout.panelW, layout.panelH, insights, insightTitle || 'Key Insights', C);
  }

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * chartWithInsight - 任意のチャート + インサイトパネル
 * data: { title, sub?, chartType: 'BAR'|'LINE'|'PIE'|'AREA', chartData, chartOpts?, insights, insightTitle?, msgBar? }
 */
function chartWithInsight(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', chartType = 'BAR', chartData = [], chartOpts = {}, insights = [], insightTitle, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const layout = _getChartLayout(msgBar, insights);
  const hasInsights = !!(insights && insights.length);
  const resolvedType = pres.charts[chartType];
  const baseOpts = {
    x: layout.chartX,
    y: layout.chartY,
    w: layout.chartW,
    h: layout.chartH,
    chartColors: chartOpts.chartColors || [C.navy, C.teal, C.navyL, C.gold],
    chartArea: chartOpts.chartArea || { fill: { color: chartType === 'PIE' ? C.white : C.bgLight }, roundedCorners: false },
    catAxisLabelColor: chartOpts.catAxisLabelColor || C.textMid,
    valAxisLabelColor: chartOpts.valAxisLabelColor || C.textMid,
    valGridLine: chartOpts.valGridLine || { color: C.border, size: 0.5 },
    catGridLine: chartOpts.catGridLine || { style: 'none' },
    legendPos: chartType === 'PIE' ? 'b' : 'b',
    showLegend: chartOpts.showLegend != null ? chartOpts.showLegend : chartData.length > 1,
    showValue: chartOpts.showValue != null ? chartOpts.showValue : chartType === 'BAR',
    dataLabelColor: chartOpts.dataLabelColor || (chartType === 'PIE' ? C.white : C.textDark),
  };

  if (chartType === 'BAR') baseOpts.barDir = 'col';
  if (chartType === 'LINE' || chartType === 'AREA') {
    baseOpts.lineSmooth = chartOpts.lineSmooth != null ? chartOpts.lineSmooth : false;
    baseOpts.lineSize = chartOpts.lineSize || 3;
    baseOpts.showValue = chartOpts.showValue != null ? chartOpts.showValue : false;
  }
  if (chartType === 'PIE') {
    baseOpts.showPercent = chartOpts.showPercent != null ? chartOpts.showPercent : true;
    baseOpts.showLegend = true;
  }

  s.addChart(resolvedType, chartData, { ...baseOpts, ...chartOpts, x: layout.chartX, y: layout.chartY, w: layout.chartW, h: layout.chartH });
  if (hasInsights) {
    _addInsightPanel(s, layout.panelX, layout.panelY, layout.panelW, layout.panelH, insights, insightTitle || 'Key Insights', C);
  }

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * stackedBarChart - 積み上げ棒グラフ
 * data: { title, sub?, series, colors?, percent?, horizontal?, insights?, msgBar? }
 */
function stackedBarChart(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', series = [], colors, percent = false, horizontal = false, insights, insightTitle, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const layout = _getChartLayout(msgBar, insights);
  s.addChart(pres.charts.BAR, series, {
    x: layout.chartX,
    y: layout.chartY,
    w: layout.chartW,
    h: layout.chartH,
    barDir: horizontal ? 'bar' : 'col',
    barGrouping: percent ? 'percentStacked' : 'stacked',
    chartColors: colors || [C.navy, C.teal, C.navyL, C.gold],
    chartArea: { fill: { color: C.bgLight }, roundedCorners: false },
    catAxisLabelColor: C.textMid,
    valAxisLabelColor: C.textMid,
    valGridLine: { color: C.border, size: 0.5 },
    catGridLine: { style: 'none' },
    showLegend: true,
    legendPos: 'b',
    showValue: true,
    dataLabelColor: C.textDark,
  });
  if (insights && insights.length) {
    _addInsightPanel(s, layout.panelX, layout.panelY, layout.panelW, layout.panelH, insights, insightTitle || 'Key Insights', C);
  }

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * executiveSummary - エグゼクティブサマリー
 * data: { title, sub?, points: [{lead, details?:[string]}], msgBar? }
 */
function executiveSummary(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', points = [], msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const items = points.slice(0, 4);
  const SX = 0.28, SY = 1.08;
  const gap = 0.10;
  const totalH = msgBar ? 3.35 : 3.9;
  const rowH = items.length ? (totalH - gap * (items.length - 1)) / items.length : totalH;

  items.forEach((point, i) => {
    const y = SY + i * (rowH + gap);
    s.addShape('rect', { x: SX, y, w: 9.44, h: rowH, fill: { color: C.bgLight }, line: { color: C.border, pt: 0.75 }, shadow: mkShadow() });
    s.addShape('rect', { x: SX, y, w: 0.10, h: rowH, fill: { color: C.teal }, line: { color: C.teal } });
    s.addText(point.lead || '', {
      x: SX + 0.22, y: y + 0.08, w: 9.0, h: 0.34,
      fontSize: 13, bold: true, color: C.navy, fontFace: C.font, valign: 'top', margin: 0
    });

    const details = (point.details || []).slice(0, 3);
    details.forEach((detail, di) => {
      const dy = y + 0.48 + di * 0.30;
      s.addText('\u2022', {
        x: SX + 0.28, y: dy - 0.01, w: 0.16, h: 0.20,
        fontSize: 12, color: C.teal, fontFace: C.font, margin: 0
      });
      s.addText(detail, {
        x: SX + 0.46, y: dy, w: 8.7, h: 0.22,
        fontSize: 10.5, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0
      });
    });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * scopeSlide - スコープ定義
 * data: { title, sub?, inScope: {label?, items:[]}, outScope: {label?, items:[]}, msgBar? }
 */
function scopeSlide(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', inScope = {}, outScope = {}, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const SX = 0.28, SY = 1.08, gap = 0.18;
  const colW = (9.44 - gap) / 2;
  const colH = msgBar ? 3.35 : 3.9;
  const cols = [
    {
      x: SX,
      label: inScope.label || 'In Scope',
      icon: '✓',
      iconColor: C.green,
      fill: 'EAF5EF',
      line: C.green,
      items: inScope.items || [],
    },
    {
      x: SX + colW + gap,
      label: outScope.label || 'Out of Scope',
      icon: '✗',
      iconColor: C.textMute,
      fill: C.bgLight,
      line: C.border,
      items: outScope.items || [],
    },
  ];

  cols.forEach((col) => {
    s.addShape('rect', { x: col.x, y: SY, w: colW, h: colH, fill: { color: col.fill }, line: { color: col.line, pt: 1 }, shadow: mkShadow() });
    s.addShape('rect', { x: col.x, y: SY, w: colW, h: 0.46, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(col.icon, {
      x: col.x + 0.14, y: SY + 0.04, w: 0.28, h: 0.34,
      fontSize: 16, bold: true, color: col.iconColor, fontFace: C.font, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(col.label, {
      x: col.x + 0.48, y: SY + 0.03, w: colW - 0.60, h: 0.36,
      fontSize: 13, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0
    });
    col.items.slice(0, 5).forEach((item, i) => {
      const iy = SY + 0.62 + i * 0.56;
      s.addShape('ellipse', {
        x: col.x + 0.18, y: iy + 0.11, w: 0.10, h: 0.10,
        fill: { color: col.iconColor }, line: { color: col.iconColor }
      });
      s.addText(String(item), {
        x: col.x + 0.36, y: iy, w: colW - 0.52, h: 0.30,
        fontSize: 11.5, color: C.textDark, fontFace: C.font, valign: 'middle', margin: 0
      });
    });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * waterfallChart - ウォーターフォールチャート
 * data: { title, sub?, startValue, startLabel, steps:[{label, value, color?}], endLabel?, unit?, showConnectors?, insights?, msgBar? }
 */
function waterfallChart(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', startValue = 0, startLabel = 'Start', steps = [], endLabel = 'End', unit = '', showConnectors = true, insights, insightTitle, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const layout = _getChartLayout(msgBar, insights);
  const chartX = layout.chartX;
  const chartY = layout.chartY;
  const chartW = layout.chartW;
  const chartH = layout.chartH;
  const plotBottom = chartY + chartH - 0.36;
  const plotTop = chartY + 0.32;
  const plotH = plotBottom - plotTop;
  const series = [{ label: startLabel, value: startValue, type: 'anchor', color: C.navy }];
  let running = startValue;
  steps.forEach((step) => {
    series.push({
      label: step.label,
      value: step.value,
      type: 'delta',
      color: step.color || (step.value >= 0 ? C.green : C.red),
      base: running,
    });
    running += step.value;
  });
  series.push({ label: endLabel, value: running, type: 'anchor', color: C.navy });

  const maxVal = Math.max(...series.map((item) => item.type === 'delta' ? Math.max(item.base, item.base + item.value) : item.value), 0);
  const minVal = Math.min(...series.map((item) => item.type === 'delta' ? Math.min(item.base, item.base + item.value) : 0), 0);
  const range = Math.max(maxVal - minVal, 1);
  const zeroY = plotBottom - ((0 - minVal) / range) * plotH;

  s.addShape('rect', { x: chartX, y: chartY, w: chartW, h: chartH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 }, shadow: mkShadow() });
  s.addShape('line', { x: chartX + 0.16, y: zeroY, w: chartW - 0.32, h: 0, line: { color: C.border, pt: 1 } });

  const n = series.length;
  const gap = 0.08;
  const barW = Math.max((chartW - 0.24 - gap * (n - 1)) / n, 0.30);
  let prevTopY = null;
  let prevRightX = null;

  series.forEach((item, i) => {
    const x = chartX + 0.12 + i * (barW + gap);
    let barTop;
    let barBottom;
    if (item.type === 'delta') {
      const fromY = plotBottom - ((item.base - minVal) / range) * plotH;
      const toY = plotBottom - (((item.base + item.value) - minVal) / range) * plotH;
      barTop = Math.min(fromY, toY);
      barBottom = Math.max(fromY, toY);
    } else {
      const anchorY = plotBottom - ((item.value - minVal) / range) * plotH;
      barTop = Math.min(anchorY, zeroY);
      barBottom = Math.max(anchorY, zeroY);
    }
    const barH = Math.max(barBottom - barTop, 0.04);
    s.addShape('rect', { x, y: barTop, w: barW, h: barH, fill: { color: item.color }, line: { color: item.color } });

    const valueLabel = `${item.type === 'delta' && item.value > 0 ? '+' : ''}${item.type === 'delta' ? item.value : item.value}${unit}`;
    s.addText(valueLabel, {
      x: x - 0.05, y: barTop - 0.22, w: barW + 0.10, h: 0.18,
      fontSize: 9.5, bold: true, color: item.color, fontFace: C.font, align: 'center', margin: 0
    });
    s.addText(item.label, {
      x: x - 0.05, y: plotBottom + 0.08, w: barW + 0.10, h: 0.30,
      fontSize: 9.5, color: C.textMid, fontFace: C.font, align: 'center', valign: 'top', margin: 0
    });

    const connectorY = item.type === 'delta'
      ? plotBottom - (((item.base + item.value) - minVal) / range) * plotH
      : plotBottom - ((item.value - minVal) / range) * plotH;
    if (showConnectors && prevTopY != null && prevRightX != null) {
      s.addShape('line', {
        x: prevRightX, y: prevTopY, w: x - prevRightX, h: connectorY - prevTopY,
        line: { color: C.textMute, pt: 1, dash: 'dash' }
      });
    }
    prevRightX = x + barW;
    prevTopY = connectorY;
  });

  if (insights && insights.length) {
    _addInsightPanel(s, layout.panelX, layout.panelY, layout.panelW, layout.panelH, insights, insightTitle || 'Key Insights', C);
  }
  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

/**
 * hBarWithExplanation - 横棒比較 + 説明
 * data: { title, sub?, legend?:[{name, color?}], rows:[{label, icon?, values:[], explanation?}], unit?, maxValue?, msgBar? }
 */
function hBarWithExplanation(pres, s, data, C = DEFAULT_THEME) {
  const { title, sub = '', legend = [], rows = [], unit = '', maxValue, msgBar = '', footerLabel, footerNum } = data;
  s.background = { color: C.white };
  addHeader(s, title, sub, C);

  const legendItems = legend.length ? legend.slice(0, 2) : [
    { name: 'Series 1', color: C.navy },
    { name: 'Series 2', color: C.teal },
  ];
  const items = rows.slice(0, 4);
  const computedMax = maxValue != null ? maxValue : Math.max(...items.flatMap((row) => row.values || []), 1);
  const SX = 0.28, SY = 1.08;
  const totalH = msgBar ? 3.35 : 3.9;
  const rowGap = 0.08;
  const rowH = items.length ? (totalH - 0.38 - rowGap * (items.length - 1)) / items.length : totalH;
  const labelW = 2.0;
  const barW = 3.0;
  const explanationW = 4.04;

  legendItems.forEach((item, i) => {
    const lx = SX + i * 1.5;
    s.addShape('rect', { x: lx, y: SY, w: 0.18, h: 0.12, fill: { color: item.color || (i === 0 ? C.navy : C.teal) }, line: { color: item.color || (i === 0 ? C.navy : C.teal) } });
    s.addText(item.name, {
      x: lx + 0.24, y: SY - 0.02, w: 1.2, h: 0.18,
      fontSize: 9.5, color: C.textMid, fontFace: C.font, valign: 'middle', margin: 0
    });
  });

  items.forEach((row, i) => {
    const y = SY + 0.28 + i * (rowH + rowGap);
    s.addShape('rect', { x: SX, y, w: 9.44, h: rowH, fill: { color: i % 2 === 0 ? C.bgLight : C.white }, line: { color: C.border, pt: 0.5 } });
    s.addText(`${row.icon ? `${row.icon} ` : ''}${row.label || ''}`, {
      x: SX + 0.12, y: y + 0.08, w: labelW - 0.18, h: rowH - 0.16,
      fontSize: 11.5, bold: true, color: C.navy, fontFace: C.font, valign: 'middle', margin: 0
    });

    const trackX = SX + labelW;
    const values = (row.values || []).slice(0, 2);
    values.forEach((val, vi) => {
      const by = y + 0.16 + vi * (rowH * 0.32);
      s.addShape('rect', { x: trackX, y: by, w: barW, h: 0.18, fill: { color: 'E2E8F2' }, line: { color: 'E2E8F2' } });
      const fillW = Math.max(Math.min((Number(val) || 0) / computedMax, 1), 0) * barW;
      const fillC = legendItems[vi] && legendItems[vi].color ? legendItems[vi].color : (vi === 0 ? C.navy : C.teal);
      s.addShape('rect', { x: trackX, y: by, w: fillW, h: 0.18, fill: { color: fillC }, line: { color: fillC } });
      s.addText(`${val}${unit}`, {
        x: trackX + barW + 0.08, y: by - 0.03, w: 0.58, h: 0.22,
        fontSize: 9.5, bold: true, color: fillC, fontFace: C.font, valign: 'middle', margin: 0
      });
    });

    s.addText(row.explanation || '', {
      x: SX + labelW + barW + 0.78, y: y + 0.08, w: explanationW - 0.14, h: rowH - 0.16,
      fontSize: 10.5, color: C.textMid, fontFace: C.font, valign: 'middle', margin: 0
    });
  });

  if (msgBar) addMsgBar(s, msgBar, C);
  addFooter(s, footerNum, '', footerLabel, C);
}

// ─── エクスポート ─────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_THEME, SW, SH,
  // ヘルパー
  addHeader, addFooter, addMsgBar, mkShadow,
  // 並列
  horizontal3, horizontal2, vertical, grid2x2, grid3,
  // 比較
  comparisonTable, beforeAfter, itemComparison, scaleComparison,
  // フロー
  flowHorizontal, flowVertical, cyclicCircle, cyclicSquare, boxFlow: cyclicSquare,
  // 分析
  matrix2x2, vennDiagram, treeChart, containment,
  // 階層
  pyramid, invertedPyramid, staircase,
  // タイムライン
  timeline,
  // グラフ
  barChartSlide, lineChartSlide, hBarChartSlide, pieChartSlide, chartWithInsight, stackedBarChart, waterfallChart, hBarWithExplanation,
  // テキスト・統計
  bigStat, caseStudy, quoteSlide, qaSlide, ranking, executiveSummary, scopeSlide,
  // ページ固有
  cover, sectionDivider, closing, tableOfContents, companyProfile, memberGrid, logoGrid,
};
