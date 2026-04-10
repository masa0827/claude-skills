# Template Catalog — slide-templates.js

全43テンプレートのAPI仕様。使用時は必ずここを確認する。

## 呼び出し規則

```javascript
const T = require('{{SKILL_DIR}}/lib/slide-templates');
const s = pres.addSlide();
T.テンプレート名(pres, s, data, C);
// ※ addHeader/addFooterはpresなし
T.addHeader(s, title, sub, C);
T.addFooter(s, num, total, label, C);
```

---

## ナビゲーション・構造

### cover — 表紙
```javascript
T.cover(pres, s, {
  title: 'タイトル',
  subtitle: 'サブタイトル',      // optional
  recipient: '株式会社〇〇 御中',  // optional
  company: 'Your Company',        // optional
  date: '2026年4月',             // optional
  bgImagePath: '/path/to/img.jpg' // optional: 背景画像
}, C);
// ⚠️ tagsパラメータは未実装。カバータグはcalling側でカスタム描画必要
```

### sectionDivider — 中表紙・セクション区切り
```javascript
T.sectionDivider(pres, s, {
  num: '01',
  title: 'セクションタイトル',
  sub: 'サブタイトル'   // optional
}, C);
```

### tableOfContents — 目次
```javascript
T.tableOfContents(pres, s, {
  title: '目次',
  items: [
    { num: '01', label: 'はじめに', active?: true },
    { num: '02', label: '現状分析' },
  ]
}, C);
```

### closing — クロージング
```javascript
T.closing(pres, s, {
  sideLabel: 'NEXT STEP',      // optional: 左帯ラベル
  title: 'まずは一歩を踏み出しましょう',
  sub: 'サブタイトル',          // optional
  items: [                     // ← message/contactは無効。items:[{text}]を使う
    { text: '30分のオンライン相談' },
    { text: '現状ヒアリング' },
    { text: '提案書お送り' },
  ],
  companyInfo: '株式会社〇〇\ninfo@example.com',  // optional
  footerLabel: 'Your Company'
}, C);
// ⚠️ message/contactパラメータは無効。items:[{text}]とcompanyInfoを使う
```

---

## カード・リスト系

### horizontal3 — 横並び3列カード
```javascript
T.horizontal3(pres, s, {
  title: 'タイトル',
  sub: 'サブタイトル',   // optional
  items: [
    { label: 'カード見出し', num: '3,000件', body: '詳細説明テキスト' },
    // num: 省略可。numがあると大きな数字として表示
  ],
  msgBar: 'まとめメッセージ'  // optional: スライド下部の帯
}, C);
```

### horizontal2 — 横並び2列（左右比較）
```javascript
T.horizontal2(pres, s, {
  title: 'タイトル',
  left: {
    label: '現状',
    items: [
      { text: '項目1', muted?: true },
    ]
  },
  right: {
    label: '改善後',
    items: [
      { text: '項目1', bold?: true },
    ]
  },
  arrow: true,    // optional: 左→右の矢印
  msgBar: '...'   // optional
}, C);
```

### beforeAfter — ビフォーアフター
```javascript
T.beforeAfter(pres, s, {
  title: 'タイトル',
  before: { label: 'Before', body: 'テキスト' },
  after: { label: 'After', body: 'テキスト' },
  msgBar: '...'   // optional
}, C);
```

### vertical — 縦並びカード（1〜5件）
```javascript
T.vertical(pres, s, {
  title: 'タイトル',
  items: [
    { num: '01', label: '見出し', body: '説明' },
    // num: 省略すると自動採番
  ],
  msgBar: '...'  // optional
}, C);
```

### grid2x2 — 2×2グリッドカード
```javascript
T.grid2x2(pres, s, {
  title: 'タイトル',
  items: [
    { num?: '01', label: '見出し', body: '説明' },
    // ← label/body を使う。title/bodyではない
  ],
  msgBar: '...'  // optional
}, C);
// ⚠️ items[].titleは無効。labelを使う
```

### grid3 — 3列グリッドカード
```javascript
T.grid3(pres, s, {
  title: 'タイトル',
  items: [
    { label: '見出し', body: '説明', icon?: '✓' },
  ],
  msgBar: '...'  // optional
}, C);
```

### ranking — ランキングリスト
```javascript
T.ranking(pres, s, {
  title: 'タイトル',
  items: [
    { rank?: 1, label: '論点1', body?: '補足説明' },
    // body: あると label の高さが制限され、bodyがlabelの下に表示
  ],
  msgBar: '...'
}, C);
```

---

## フロー・プロセス系

### flowHorizontal — 横フロー（4〜5ステップ）
```javascript
T.flowHorizontal(pres, s, {
  title: 'タイトル',
  steps: [
    { num: '01', label: 'ステップ1', body: '説明' },
  ],
  msgBar: '...'
}, C);
```

### flowVertical — 縦フロー
```javascript
T.flowVertical(pres, s, {
  title: 'タイトル',
  steps: [
    { label: 'ステップ1', body: '説明' },
  ],
  msgBar: '...'
}, C);
```

### staircase — 階段型フロー
```javascript
T.staircase(pres, s, {
  title: 'タイトル',
  steps: [
    { label: 'Step 1', body?: '説明' },
    // ⚠️ body: blockHが0.9以下の場合は非表示（ステップ数が多いと省略される）
  ],
  msgBar: '...'
}, C);
```

### timeline — タイムライン
```javascript
T.timeline(pres, s, {
  title: 'タイトル',
  items: [
    { date: '2020', label: '出来事', body?: '詳細' },
  ],
  msgBar: '...'
}, C);
```

---

## 比較・評価系

### comparisonTable — 比較表（列強調対応）
```javascript
T.comparisonTable(pres, s, {
  title: 'タイトル',
  headers: ['', '案A', '案B', '案C'],
  rows: [
    { label: '評価軸1', cells: ['◎', '○', '△'] },
  ],
  highlightCol: 1,   // optional: 0始まり（headerを含む列インデックス）
  msgBar: '...'
}, C);
```

### itemComparison — アイテム比較（複数行×複数列）
```javascript
T.itemComparison(pres, s, {
  title: 'タイトル',
  items: [
    { label: '会社名', cols: ['特徴1', '特徴2', '特徴3'] },
  ],
  headers?: ['機能A', '機能B', '機能C'],
  msgBar: '...'
}, C);
```

### scaleComparison — スケール比較（棒グラフ風）
```javascript
T.scaleComparison(pres, s, {
  title: 'タイトル',
  items: [
    { label: '項目1', value: 85, unit?: '%' },
  ],
  msgBar: '...'
}, C);
```

---

## 図解・関係性系

### matrix2x2 — 2×2マトリクス
```javascript
T.matrix2x2(pres, s, {
  title: 'タイトル',
  xLabel: 'X軸ラベル',
  // yLabel: '...',  ← 配置バグあり。使わない推奨
  quadrants: [
    { pos: 'TL', label: '左上', body?: '説明' },
    { pos: 'TR', label: '右上', body?: '説明' },
    { pos: 'BL', label: '左下', body?: '説明' },
    { pos: 'BR', label: '右下', body?: '説明' },
  ],
  dots?: [
    { x: 0.7, y: 0.3, label: 'プロット点' },  // x/y: 0.0〜1.0
  ]
}, C);
```

### pyramid — ピラミッド（上から下へ）
```javascript
T.pyramid(pres, s, {
  title: 'タイトル',
  layers: [
    { label: 'トップ', body?: '説明', color?: 'HEXCOLOR' },
  ]  // 上から下の順
}, C);
```

### invertedPyramid — 逆ピラミッド
```javascript
T.invertedPyramid(pres, s, {
  title: 'タイトル',
  layers: [ ... ]  // 上から下の順（逆三角形）
}, C);
```

### cyclicCircle — 循環図（円形）
```javascript
T.cyclicCircle(pres, s, {
  title: 'タイトル',
  items: [
    { label: 'フェーズ1', body?: '説明' },
  ]  // 3〜5件推奨
}, C);
```

### cyclicSquare — 循環図（四角形）
```javascript
T.cyclicSquare(pres, s, {
  title: 'タイトル',
  items: [
    { label: 'フェーズ1', body?: '説明' },
  ]  // 4件推奨
}, C);
```

### vennDiagram — ベン図（2〜3円）
```javascript
T.vennDiagram(pres, s, {
  title: 'タイトル',
  circles: [
    { label: '円A', color?: 'HEXCOLOR' },
    { label: '円B', color?: 'HEXCOLOR' },
  ],
  centerLabel?: '重なり部分'
}, C);
```

### treeChart — ツリー図
```javascript
T.treeChart(pres, s, {
  title: 'タイトル',
  root: 'ルートノード',
  children: [
    { label: '子1', children?: ['孫1', '孫2'] },
  ]
  // ⚠️ 子ノードが4以上の場合、接続線が描画されない場合あり
}, C);
```

### containment — 包含図（入れ子）
```javascript
T.containment(pres, s, {
  title: 'タイトル',
  layers: [
    { label: '外側', body?: '説明' },
    { label: '内側', body?: '説明' },
  ]  // 外→内の順
}, C);
```

---

## チャート系

**⚠️ 重要: チャートを使ったら必ずfix_chart_labels.pyを実行する**
（pptxgenjsのバグでX軸ラベルがPowerPointで数値インデックスになるため）

```javascript
const { execFileSync } = require('child_process');
// pres.writeFile() の .then() の中で実行
execFileSync('python', [
  '{{SKILL_DIR}}/lib/scripts/fix_chart_labels.py',
  outFile
], { stdio: 'inherit' });
```

### barChartSlide — 縦棒グラフ
```javascript
T.barChartSlide(pres, s, {
  title: 'タイトル',
  chartTitle?: 'チャートタイトル',
  series: [
    { name: '系列名', labels: ['A', 'B', 'C'], values: [100, 200, 150] },
  ],
  colors?: ['2E7D8E', '1B3254'],
  msgBar?: '...'
}, C);
```

### lineChartSlide — 折れ線グラフ
```javascript
T.lineChartSlide(pres, s, {
  title: 'タイトル',
  series: [
    { name: '系列名', labels: ['Jan', 'Feb', 'Mar'], values: [32, 35, 42] },
  ],
  colors?: ['...'],
  msgBar?: '...'
}, C);
```

### hBarChartSlide — 横棒グラフ
```javascript
T.hBarChartSlide(pres, s, {
  title: 'タイトル',
  series: [
    { name: '系列名', labels: ['項目A', '項目B'], values: [75, 60] },
  ],
  colors?: ['...'],
  msgBar?: '...'
}, C);
```

### pieChartSlide — 円グラフ
```javascript
T.pieChartSlide(pres, s, {
  title: 'タイトル',
  series: [
    { name: '系列', labels: ['A', 'B', 'C'], values: [35, 45, 20] },
  ],
  colors?: ['...'],
  msgBar?: '...'
}, C);
```

---

## インパクト系

### bigStat — 大きな数字3つ
```javascript
T.bigStat(pres, s, {
  title: 'タイトル',
  stats: [
    { value: '3,000', unit: '件', label: '累計登録数' },
    { value: '87', unit: '%', label: '継続率' },
    { value: '2.5', unit: '倍', label: 'ROI改善' },
  ],
  msgBar?: '...'
}, C);
```

### quoteSlide — 引用・証言
```javascript
T.quoteSlide(pres, s, {
  title?: 'タイトル',
  quote: '「ここに引用テキストを入れる」',
  author?: '— 氏名, 肩書き',
  msgBar?: '...'
}, C);
```

### caseStudy — 事例紹介
```javascript
T.caseStudy(pres, s, {
  title: 'タイトル',
  company?: '株式会社〇〇',
  challenge: '課題: ...',
  solution: '解決策: ...',
  result: '結果: ...',
  msgBar?: '...'
}, C);
```

### qaSlide — Q&Aスライド
```javascript
T.qaSlide(pres, s, {
  title?: 'Q&A',
  items: [
    { q: '質問文', a: '回答文' },
  ],
  msgBar?: '...'
}, C);
```

---

## 会社紹介系

### companyProfile — 会社紹介
```javascript
T.companyProfile(pres, s, {
  title?: '会社概要',
  name: '株式会社〇〇',
  founded?: '2024年',
  description: '会社説明',
  details?: [
    { label: '代表', value: '山田太郎' },
  ]
}, C);
```

### memberGrid — メンバー紹介グリッド
```javascript
T.memberGrid(pres, s, {
  title?: 'チーム',
  members: [
    { name: '山田太郎', role: '代表取締役', bio?: '経歴...' },
  ]
}, C);
```

### logoGrid — ロゴグリッド（実績・パートナー）
```javascript
T.logoGrid(pres, s, {
  title?: '導入実績',
  logos: [
    { path: '/path/to/logo.png', label?: '会社名' },
  ]
}, C);
```

---

## コンサルグレード系（McKinseyスタイル）

### chartWithInsight — 任意チャート＋インサイトパネル
```javascript
T.chartWithInsight(pres, s, {
  title: 'タイトル',
  chartType: 'BAR' | 'LINE' | 'PIE' | 'AREA',  // default: 'BAR'
  chartData: [
    { name: '系列名', labels: ['Jan', 'Feb'], values: [10, 20] },
  ],
  insights: ['ポイント1', 'ポイント2'],  // 右パネルに表示
  insightTitle?: 'Key Insights',
  chartOpts?: {},   // pptxgenjsチャートオプションを直接上書き
  msgBar?: '注記'
}, C);
// ⚠️ 既存4チャート(barChart/lineChart/hBarChart/pieChart)のinsightsパラメータも同等機能あり
```

### stackedBarChart — 積み上げ棒グラフ
```javascript
T.stackedBarChart(pres, s, {
  title: 'タイトル',
  series: [                // ← 'chartData'ではなく'series'
    { name: '事業A', labels: ['2021', '2022'], values: [100, 120] },
    { name: '事業B', labels: ['2021', '2022'], values: [80, 100] },
  ],
  percent?: false,      // true で100%積み上げ
  horizontal?: false,   // true で横棒
  colors?: ['XXXXXX'],  // 省略時はデフォルトテーマ色
  insights?: ['ポイント1'],
  insightTitle?: 'Key Insights',
  msgBar?: '注記'
}, C);
```

### executiveSummary — エグゼクティブサマリー
```javascript
T.executiveSummary(pres, s, {
  title: 'タイトル',
  points: [             // 最大4行
    {
      lead: '① 太字のリード文（1行）',
      details: [        // 最大3行のバレット
        '詳細テキスト1',
        '詳細テキスト2',
      ]
    },
  ],
  msgBar?: '注記'
}, C);
// ⚠️ pointsの各要素は {lead, details} 形式。{heading, bullets} ではない
```

### scopeSlide — スコープ定義（✓/✗）
```javascript
T.scopeSlide(pres, s, {
  title: 'タイトル',
  inScope: {
    label?: '対象範囲（In Scope）',  // optional: ヘッダーラベル
    items: ['項目1', '項目2'],        // 文字列配列
  },
  outScope: {
    label?: '対象外（Out of Scope）',
    items: ['項目1', '項目2'],
  },
  msgBar?: '注記'
}, C);
// ⚠️ inScope/outScope は配列ではなくオブジェクト形式
```

### waterfallChart — ウォーターフォールチャート
```javascript
T.waterfallChart(pres, s, {
  title: 'タイトル',
  startValue: 500,        // 開始値
  startLabel: '前期売上',  // 開始バーのラベル
  steps: [               // 増減ステップ
    { label: '新規顧客', value: 120 },          // 正: 緑
    { label: '解約', value: -60 },             // 負: 赤
    { label: '一時費用', value: -30, color?: 'XXXXXX' }, // 色指定可
  ],
  endLabel?: '今期売上',   // 合計バーのラベル
  unit?: 'M',            // 値ラベルの単位（例: 'M', '円'）
  showConnectors?: true, // バー間の破線コネクタ
  insights?: ['ポイント1'],
  insightTitle?: 'Key Insights',
  msgBar?: '注記'
}, C);
// ⚠️ 'items'形式ではなく startValue + steps + endLabel 形式
```

### hBarWithExplanation — 横棒比較＋解説
```javascript
T.hBarWithExplanation(pres, s, {
  title: 'タイトル',
  legend: [                        // optional: 凡例（省略時: Series 1/2）
    { name: '自社', color: C.navy },
    { name: '競合A', color: C.teal },
  ],
  rows: [                          // 最大4行
    {
      label: '製品品質スコア',
      values: [88, 72],            // 数値配列（最大2系列）
      icon?: '🔵',                 // optional: 行頭アイコン
      explanation?: '解説テキスト（右側に表示）',
    },
  ],
  maxValue?: 100,  // 全行共通の最大値（省略時: valuesの最大値から自動計算）
  unit?: '点',     // 全行共通の単位表示
  msgBar?: '注記'
}, C);
// ⚠️ rows[].bars[] 形式ではなく rows[].values[] 形式
// ⚠️ maxValue/unit は全行共通。行ごとに変えたい場合は値を正規化して渡す
```

---

## ヘルパー関数

```javascript
T.addHeader(s, title, sub, C);    // pres引数なし ← よく間違える
T.addFooter(s, num, total, label, C);  // pres引数なし
// addMsgBar はexportなし。各テンプレートのmsgBarパラメータで使う
```

---

## テンプレート選択チートシート

| 状況 | テンプレート |
|------|------------|
| 「3つの理由がある」 | `horizontal3` |
| 「4つの要素/機能がある」 | `grid2x2` |
| 「現状と解決後の対比」 | `beforeAfter` または `horizontal2` |
| 「4ステップのプロセス」 | `flowHorizontal` |
| 「A社・B社・C社を比較」 | `comparisonTable` |
| 「市場は拡大している（グラフ）」 | `barChartSlide` または `lineChartSlide` |
| 「3つの大きな数字で示す」 | `bigStat` |
| 「重要な5つの論点」 | `ranking` または `vertical` |
| 「時系列で見ると」 | `timeline` |
| 「〇〇の中心に△△がある」 | `containment` または `cyclicCircle` |
| 「お客様の声」 | `quoteSlide` |
| 「成功事例：A社」 | `caseStudy` |
