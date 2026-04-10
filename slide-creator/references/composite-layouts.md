# 複合レイアウトパターン集

テンプレート1つでは表現できないビジネス資料の典型レイアウト。
pptxgenjsの生API（addChart / addShape / addText）で組み立てる。

座標系: LAYOUT_16x9 = 10" × 5.625"（SW=10, SH=5.625）
ヘッダー占有: y=0〜0.95（T.addHeader使用時）
フッター占有: y=5.3〜5.625（T.addFooter使用時）
コンテンツ領域: y=1.0〜5.2（高さ4.2"）

---

## パターン①：グラフ（左60%）+ インサイトパネル（右40%）

**用途**: 「データを見せながら、何を読み取るべきかを右に明示する」

```javascript
function slideChartWithInsight(pres, s, data, C = T.DEFAULT_THEME) {
  // data: { title, sub?, chartData: [{name, labels, values}], insights: [{text, bold?}], msgBar?, footerNum? }
  const { title, sub = '', chartData, insights = [], msgBar = '', footerNum } = data;

  s.background = { color: C.white };
  T.addHeader(s, title, sub, C);

  const SY = 1.05;
  const availH = msgBar ? 3.35 : 4.0;
  const chartW = 5.8, insightW = 3.6;
  const chartX = 0.28, insightX = 6.28;

  // ── 左: チャート ──
  s.addChart(pres.charts.BAR, chartData, {
    x: chartX, y: SY, w: chartW, h: availH,
    barDir: 'col',
    chartColors: [C.teal, C.navy, C.gold],
    chartArea: { fill: { color: C.white } },
    catAxisLabelColor: C.textMute,
    valAxisLabelColor: C.textMute,
    catAxisLabelFontSize: 11,
    valAxisLabelFontSize: 10,
    valGridLine: { color: 'E2E8F0', size: 0.5 },
    catGridLine: { style: 'none' },
    showLegend: chartData.length > 1,
    legendPos: 'b',
    legendFontSize: 10,
    showValue: true,
    dataLabelColor: C.textDark,
    dataLabelFontSize: 10,
  });

  // ── 右: インサイトパネル ──
  s.addShape('rect', {
    x: insightX, y: SY, w: insightW, h: availH,
    fill: { color: C.bgLight }, line: { color: C.border, pt: 1 },
    shadow: { type: 'outer', blur: 4, offset: 2, angle: 135, color: '000000', opacity: 0.06 }
  });
  // ヘッダーバー
  s.addShape('rect', { x: insightX, y: SY, w: insightW, h: 0.38, fill: { color: C.navy }, line: { color: C.navy } });
  s.addText('ここが重要', {
    x: insightX, y: SY, w: insightW, h: 0.38,
    fontSize: 11, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0
  });

  const itemH = (availH - 0.5) / Math.min(insights.length, 4);
  insights.slice(0, 4).forEach((item, i) => {
    const iy = SY + 0.45 + i * itemH;
    // アクセントドット
    s.addShape('oval', {
      x: insightX + 0.18, y: iy + itemH / 2 - 0.1, w: 0.2, h: 0.2,
      fill: { color: item.bold ? C.teal : C.navyL }, line: { color: 'transparent', pt: 0 }
    });
    s.addText(item.text, {
      x: insightX + 0.48, y: iy, w: insightW - 0.6, h: itemH - 0.08,
      fontSize: 12, bold: !!item.bold, color: item.bold ? C.navy : C.textMid,
      fontFace: C.font, valign: 'middle', margin: 0
    });
  });

  if (msgBar) T.addMsgBar ? T.addMsgBar(s, msgBar, C) : null;
  T.addFooter(s, footerNum, '', '', C);
}
```

**使用例**:
```javascript
slideChartWithInsight(pres, s3, {
  title: 'インバウンド需要は急拡大している',
  sub: '外国人スキー人口の推移',
  chartData: [{
    name: '訪日スキー客数（万人）',
    labels: ['2019', '2022', '2023', '2024'],
    values: [120, 85, 145, 198]
  }],
  insights: [
    { text: '2024年はコロナ前比165%まで回復', bold: true },
    { text: '北米・欧州からの長期滞在型が増加' },
    { text: 'リフト券単価: 訪日客は国内客の2.3倍' },
    { text: 'まだ受け皿が整っていない市場' },
  ],
  msgBar: 'インバウンド需要を取りこぼしている事業者が多い'
}, C);
```

---

## パターン②：2グラフ並列（双軸比較）

**用途**: 「対照的な2つのトレンドを並べて見せる（国内減少 vs インバウンド増加など）」

```javascript
function slideDualChart(pres, s, data, C = T.DEFAULT_THEME) {
  // data: { title, sub?, left: {chartTitle, series, colors?}, right: {chartTitle, series, colors?}, msgBar? }
  const { title, sub = '', left, right, msgBar = '', footerNum } = data;

  s.background = { color: C.white };
  T.addHeader(s, title, sub, C);

  const SY = 1.05;
  const availH = msgBar ? 3.3 : 3.9;
  const chartW = 4.5, gap = 0.44;
  const lx = 0.28, rx = lx + chartW + gap;

  const chartOpts = (series, colors, chartTitle) => ({
    x: 0, y: SY, w: chartW, h: availH,  // x は後でoverrideする
    barDir: 'col',
    chartColors: colors || [C.teal],
    chartArea: { fill: { color: 'F8FAFC' }, roundedCorners: false },
    catAxisLabelColor: C.textMute,
    valAxisLabelColor: C.textMute,
    catAxisLabelFontSize: 10,
    valGridLine: { color: 'E2E8F0', size: 0.5 },
    catGridLine: { style: 'none' },
    showTitle: !!chartTitle,
    title: chartTitle || '',
    titleFontSize: 12,
    titleColor: C.textDark,
    showLegend: false,
    showValue: true,
    dataLabelFontSize: 10,
    dataLabelColor: C.textDark,
  });

  // 左チャート
  const leftOpts = { ...chartOpts(left.series, left.colors, left.chartTitle), x: lx };
  s.addChart(pres.charts.BAR, left.series, leftOpts);

  // 右チャート
  const rightOpts = { ...chartOpts(right.series, right.colors, right.chartTitle), x: rx };
  s.addChart(pres.charts.BAR, right.series, rightOpts);

  // 中央の「VS」または矢印区切り
  s.addText('→', {
    x: lx + chartW + 0.04, y: SY + availH / 2 - 0.3, w: 0.36, h: 0.6,
    fontSize: 22, bold: true, color: C.teal, fontFace: C.font, align: 'center', valign: 'middle', margin: 0
  });

  if (msgBar) {
    s.addShape('rect', { x: 0, y: 4.84, w: 10, h: 0.44, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(msgBar, { x: 0.3, y: 4.84, w: 9.4, h: 0.44, fontSize: 13, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
  }
  T.addFooter(s, footerNum, '', '', C);
}
```

**使用例**:
```javascript
slideDualChart(pres, s3, {
  title: '市場の構造変化',
  sub: '国内スキー人口の減少 vs インバウンド需要の拡大',
  left: {
    chartTitle: '国内スキー人口（万人）',
    series: [{ name: '国内スキー人口', labels: ['1998', '2010', '2019', '2024'], values: [1800, 1200, 780, 520] }],
    colors: ['9B9B9B']
  },
  right: {
    chartTitle: '訪日スキー客数（万人）',
    series: [{ name: 'インバウンド', labels: ['2019', '2021', '2022', '2024'], values: [120, 40, 85, 198] }],
    colors: ['2E7D8E']
  },
  msgBar: '「国内は縮小・インバウンドは拡大」という構造変化が加速している'
}, C);
```

---

## パターン③：全幅グラフ + 下部コメント3列

**用途**: 「大きなデータを見せた上で、3つの読み取りポイントを添える」

```javascript
function slideChartWithComments(pres, s, data, C = T.DEFAULT_THEME) {
  // data: { title, sub?, series, chartType?, comments: [{label, text}] }
  const { title, sub = '', series, chartType = 'BAR', comments = [], footerNum } = data;

  s.background = { color: C.white };
  T.addHeader(s, title, sub, C);

  const chartH = 2.8;
  s.addChart(pres.charts[chartType], series, {
    x: 0.28, y: 1.05, w: 9.44, h: chartH,
    barDir: 'col',
    chartColors: [C.teal, C.navy, C.gold, C.green],
    chartArea: { fill: { color: C.white } },
    catAxisLabelColor: C.textMute,
    valAxisLabelColor: C.textMute,
    catAxisLabelFontSize: 11,
    valGridLine: { color: 'E2E8F0', size: 0.5 },
    catGridLine: { style: 'none' },
    showLegend: series.length > 1,
    legendPos: 'r',
    showValue: true,
    dataLabelFontSize: 10,
  });

  // 下部コメント3列
  const commentY = 1.05 + chartH + 0.12;
  const commentH = 5.1 - commentY;
  const commentW = 9.44 / 3 - 0.1;
  comments.slice(0, 3).forEach((c, i) => {
    const cx = 0.28 + i * (commentW + 0.15);
    s.addShape('rect', {
      x: cx, y: commentY, w: commentW, h: commentH,
      fill: { color: i === 0 ? 'EAF5F8' : C.bgLight },
      line: { color: i === 0 ? C.teal : C.border, pt: i === 0 ? 2 : 1 }
    });
    s.addShape('rect', { x: cx, y: commentY, w: commentW, h: 0.3, fill: { color: i === 0 ? C.teal : C.navy }, line: { color: 'transparent', pt: 0 } });
    s.addText(c.label, {
      x: cx, y: commentY, w: commentW, h: 0.3,
      fontSize: 10, bold: true, color: C.white, fontFace: C.font, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(c.text, {
      x: cx + 0.1, y: commentY + 0.36, w: commentW - 0.2, h: commentH - 0.44,
      fontSize: 11, color: C.textMid, fontFace: C.font, valign: 'top', margin: 0
    });
  });

  T.addFooter(s, footerNum, '', '', C);
}
```

**使用例**:
```javascript
slideChartWithComments(pres, s4, {
  title: '売上構成の変化（2020→2024）',
  series: [{
    name: '売上（億円）',
    labels: ['2020', '2021', '2022', '2023', '2024'],
    values: [12.4, 14.1, 18.3, 22.7, 31.5]
  }],
  comments: [
    { label: '成長ドライバー', text: '2022年以降のEC事業拡大が全体の成長を牽引。前年比130%を3年連続で達成。' },
    { label: '課題', text: 'オフライン店舗の売上は横ばい。人件費上昇で利益率が圧迫されている。' },
    { label: '次の一手', text: 'ECと店舗の在庫連携が未着手。ここを統合すると機会損失20%の回収が見込める。' },
  ]
}, C);
```

---

## パターン④：テンプレート + カスタムオーバーレイ

**用途**: 「テンプレートの構造はそのまま使いつつ、強調要素を追加する」

```javascript
// horizontal3テンプレートの上に「注目マーク」を追加
T.horizontal3(pres, s, {
  title: '3つのアセット',
  items: [
    { label: 'データベース', body: '登録スキー場300件' },
    { label: 'メディア', body: '月間30万PV' },
    { label: '送客実績', body: '年間5万人' },
  ]
}, C);

// ★ここだけ強調（テンプレート呼び出し後に重ねる）
s.addShape('rect', {
  x: 0.28, y: 1.08, w: 3.0, h: 0.06,
  fill: { color: C.gold }, line: { color: C.gold }
});
s.addText('最重要', {
  x: 0.28, y: 1.1, w: 1.5, h: 0.28,
  fontSize: 9, bold: true, color: C.white, fontFace: C.font,
  fill: { color: C.gold }, align: 'center', valign: 'middle', margin: 0
});
```

---

## パターン⑤：ポジショニングマップ（散布図風）

**用途**: 「競合の立ち位置を2軸で整理する」

```javascript
function slidePositioningMap(pres, s, data, C = T.DEFAULT_THEME) {
  // data: { title, sub?, xLabel: {low, high}, yLabel: {low, high}, dots: [{x, y, label, highlight?}], msgBar? }
  const { title, sub = '', xLabel, yLabel, dots = [], msgBar = '', footerNum } = data;

  s.background = { color: C.white };
  T.addHeader(s, title, sub, C);

  const MAP_X = 1.2, MAP_Y = 1.1, MAP_W = 7.8, MAP_H = 3.6;
  const hasMsgBar = !!msgBar;
  const mapH = hasMsgBar ? 3.2 : MAP_H;

  // 背景
  s.addShape('rect', { x: MAP_X, y: MAP_Y, w: MAP_W, h: mapH, fill: { color: C.bgLight }, line: { color: C.border, pt: 1 } });

  // X軸
  s.addShape('line', {
    x: MAP_X, y: MAP_Y + mapH / 2, w: MAP_W, h: 0,
    line: { color: C.border, pt: 1, dashType: 'dash' }
  });
  // Y軸
  s.addShape('line', {
    x: MAP_X + MAP_W / 2, y: MAP_Y, w: 0, h: mapH,
    line: { color: C.border, pt: 1, dashType: 'dash' }
  });

  // 軸ラベル
  if (xLabel) {
    s.addText(xLabel.low, { x: MAP_X + 0.1, y: MAP_Y + mapH + 0.05, w: 1.5, h: 0.25, fontSize: 9, color: C.textMute, fontFace: C.font, margin: 0 });
    s.addText(xLabel.high, { x: MAP_X + MAP_W - 1.6, y: MAP_Y + mapH + 0.05, w: 1.5, h: 0.25, fontSize: 9, color: C.textMute, fontFace: C.font, align: 'right', margin: 0 });
  }
  if (yLabel) {
    s.addText(yLabel.high, { x: MAP_X - 1.1, y: MAP_Y, w: 1.0, h: 0.3, fontSize: 9, color: C.textMute, fontFace: C.font, align: 'right', margin: 0 });
    s.addText(yLabel.low, { x: MAP_X - 1.1, y: MAP_Y + mapH - 0.3, w: 1.0, h: 0.3, fontSize: 9, color: C.textMute, fontFace: C.font, align: 'right', margin: 0 });
  }

  // プロット点（x/y: 0.0〜1.0）
  dots.forEach(dot => {
    const px = MAP_X + dot.x * MAP_W;
    const py = MAP_Y + (1 - dot.y) * mapH;  // y=1.0が上
    const r = dot.highlight ? 0.2 : 0.15;
    const fillColor = dot.highlight ? C.teal : C.navyL;
    s.addShape('oval', {
      x: px - r / 2, y: py - r / 2, w: r, h: r,
      fill: { color: fillColor }, line: { color: fillColor }
    });
    s.addText(dot.label, {
      x: px - 0.8, y: py + r / 2 + 0.02, w: 1.6, h: 0.28,
      fontSize: dot.highlight ? 11 : 10, bold: !!dot.highlight,
      color: dot.highlight ? C.teal : C.textMid,
      fontFace: C.font, align: 'center', margin: 0
    });
  });

  if (msgBar) {
    s.addShape('rect', { x: 0, y: 4.84, w: 10, h: 0.44, fill: { color: C.navy }, line: { color: C.navy } });
    s.addText(msgBar, { x: 0.3, y: 4.84, w: 9.4, h: 0.44, fontSize: 13, bold: true, color: C.white, fontFace: C.font, valign: 'middle', margin: 0 });
  }
  T.addFooter(s, footerNum, '', '', C);
}
```

**使用例**:
```javascript
slidePositioningMap(pres, s5, {
  title: '競合ポジショニングマップ',
  sub: '横断仲介力 vs デジタル対応力',
  xLabel: { low: 'アナログ対応', high: 'デジタル対応強' },
  yLabel: { low: '単一ジャンル', high: '横断仲介力強' },
  dots: [
    { x: 0.75, y: 0.8, label: '自社サービス', highlight: true },
    { x: 0.4, y: 0.6, label: '競合A' },
    { x: 0.8, y: 0.3, label: '競合B' },
    { x: 0.2, y: 0.4, label: '競合C' },
  ],
  msgBar: '自社サービスは横断仲介力でユニークなポジションを持つ'
}, C);
```

---

## チャートオプション共通リファレンス

```javascript
// よく使うチャートオプションの組み合わせ
const cleanChartOpts = {
  chartArea: { fill: { color: 'FFFFFF' } },
  catAxisLabelColor: '64748B',
  valAxisLabelColor: '64748B',
  catAxisLabelFontSize: 11,
  valAxisLabelFontSize: 10,
  valGridLine: { color: 'E2E8F0', size: 0.5 },
  catGridLine: { style: 'none' },
  showLegend: false,
  showValue: true,
  dataLabelFontSize: 10,
  dataLabelColor: '1E293B',
};
// ⚠️ チャート使用後は必ず fix_chart_labels.py を実行する
```

---

## 注意：複合レイアウトでのfix_chart_labels.py

チャートを1枚でも使ったら、全体のwriteFile後に実行する。
複数チャートがあっても1回の実行で全て修正される。
