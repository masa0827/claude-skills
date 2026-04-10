---
name: slide-creator
description: "Use this skill whenever the user asks to create, generate, or build a slide deck, presentation, proposal document, or pitch material in PPTX format — even if they haven't specified PowerPoint explicitly. Triggers on phrases like 'スライドを作って', 'プレゼン資料', '提案書', 'pitch deck', 'make a presentation'. IMPORTANT: Do NOT skip the upstream process. Do NOT start coding immediately. Always begin by clarifying the message and structure first."
---

> **SKILL_DIR**: このSKILL.mdが置かれているディレクトリの絶対パス
> スクリプト生成時は必ずこのパスを解決してから使用すること。

# Slide Creator Skill

## Overview

スライド制作は「上流→確認→下流」の順で進める。上流を省略すると「動く資料」は作れても「伝わる資料」にならない。この順番は絶対に守る。

**ツール**: pptxgenjs + slide-templates.js（43テンプレートライブラリ）
**テンプレートパス**: `{{SKILL_DIR}}/lib/slide-templates.js`
**出力形式**: `.pptx`（LAYOUT_16x9: 10"×5.625"）

---

## Step 1: 上流工程（実装前に必ず実施）

### 1-1. 目的×ターゲット
依頼文から読み取る。不明なら確認する：
- 誰に見せるか（社内/クライアント/投資家）
- 何をしてほしいか（理解/承認/行動）
- 読む場面（会議で説明/メールで送付/自分で読む）

### 1-2. 資料全体で「何を伝えるか」を1文で言語化
例：「〇〇サービスはインバウンド需要の取りこぼしが最大の課題であり、当社が提供する仕組みでそれを解決できる」

この1文が決まらないうちはスライド構成に入らない。

### 1-3. スライド構成（枚数・順番・各スライドの役割）
各スライドについて：
- **このスライドで何を感じさせるか**（驚き/安心/納得/urgency）
- **主役の視覚要素は何か**（グラフ/フロー図/数字3つ/表）
- 必要なデータ・事実は何か

→ **ユーザーに提示して確認を取る。確認なしにStep 2へ進まない。**

---

## Step 2: 下流工程（確認後）

### 2-1. テンプレート選択

各スライドの目的に最適なテンプレートを選ぶ。テンプレート選択の原則：

| 目的 | 推奨テンプレート |
|------|----------------|
| 概要・目次 | `tableOfContents`, `sectionDivider` |
| 3つの理由・特徴 | `horizontal3`, `grid2x2`, `grid3` |
| ビフォーアフター | `beforeAfter`, `horizontal2` |
| 手順・フロー | `flowHorizontal`, `flowVertical`, `staircase` |
| 比較・選択肢 | `comparisonTable`, `scaleComparison`, `itemComparison` |
| 数字インパクト | `bigStat`, `ranking` |
| データ可視化 | `barChartSlide`, `lineChartSlide`, `hBarChartSlide`, `pieChartSlide` |
| 関係性・構造 | `matrix2x2`, `pyramid`, `invertedPyramid`, `treeChart`, `cyclicCircle`, `cyclicSquare`, `containment`, `vennDiagram` |
| 時間軸 | `timeline` |
| 引用・証言 | `quoteSlide`, `caseStudy` |
| Q&A | `qaSlide` |
| 縦リスト | `vertical` |
| 表紙 | `cover` |
| 中表紙 | `sectionDivider` |
| 締め | `closing` |
| 会社紹介 | `companyProfile`, `memberGrid`, `logoGrid` |

**詳細なAPI仕様** → `references/template-catalog.md` を読む

### 2-2. カラーテーマ設定

`DEFAULT_THEME`（navy/teal/white）はそのまま使えるが、クライアントカラーがある場合はカスタムテーマを定義する：

```javascript
const C = {
  ...T.DEFAULT_THEME,
  navy: '1B3254',   // dominant (60-70%の視覚ウェイト)
  teal: '2E7D8E',   // secondary
  gold: 'C8A951',   // accent
};
```

- 表紙・クロージング: 濃い背景（ダーク）
- コンテンツスライド: 白/ライトグレー背景（ライト）

### 2-3. 表紙画像の取得（必須）

表紙には必ずトピックに関連したフリー画像を入れる。画像なしの表紙（単色背景）は見劣りする。

**loremflickr** を使ってダウンロードする（無料・商用可・ライセンス不要）：

```bash
# キーワードはプレゼンのトピックに合わせる（英語）
curl -L "https://loremflickr.com/1920/1080/[keyword1],[keyword2]" -o /tmp/cover-[topic].jpg
```

例：
```bash
# スキー場・雪山の提案資料
curl -L "https://loremflickr.com/1920/1080/ski,mountain,snow" -o /tmp/cover-ski.jpg

# テクノロジー・AIの資料
curl -L "https://loremflickr.com/1920/1080/technology,digital,abstract" -o /tmp/cover-tech.jpg

# ビジネス・企業の提案
curl -L "https://loremflickr.com/1920/1080/business,office,meeting" -o /tmp/cover-biz.jpg

# 不動産・建設
curl -L "https://loremflickr.com/1920/1080/architecture,building,city" -o /tmp/cover-arch.jpg

# 医療・ヘルスケア
curl -L "https://loremflickr.com/1920/1080/healthcare,medical,hospital" -o /tmp/cover-health.jpg
```

ダウンロード後、`bgImagePath` に渡す。coverテンプレートが自動でネイビーの半透明オーバーレイをかけるので、どんな画像でもテキストが読みやすくなる。

### 2-4. コード生成

```javascript
const pptxgen = require('pptxgenjs');
const T = require('{{SKILL_DIR}}/lib/slide-templates');
const { execFileSync } = require('child_process');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // ← 必ずこれ。LAYOUT_WIDEは禁止

const C = T.DEFAULT_THEME; // またはカスタムテーマ

// スライドを追加
const s1 = pres.addSlide();
T.cover(pres, s1, { title: '...', subtitle: '...', bgImagePath: '/tmp/cover-[topic].jpg' }, C);

// ... 各スライド ...

const outFile = '/path/to/output.pptx';
pres.writeFile({ fileName: outFile })
  .then(() => {
    // チャートがある場合はfix_chart_labels.pyを実行（必須）
    execFileSync('python', [
      '{{SKILL_DIR}}/lib/scripts/fix_chart_labels.py',
      outFile
    ], { stdio: 'inherit' });
    console.log('Done:', outFile);
  });
```

**既知のAPI注意点** → `references/pitfalls.md` を読む

---

## Step 3: QA（省略禁止）

### 3-1. コンテンツQA
```bash
python -m markitdown output.pptx
```
- 内容の抜け・ミス・順番を確認
- プレースホルダーが残っていないか確認

### 3-2. ビジュアルQA（必ずサブエージェントで実施）
```bash
# PPTXをPDFに変換
python {{SKILL_DIR}}/lib/scripts/office/soffice.py --headless --convert-to pdf output.pptx
# PDFを画像に変換
pdftoppm -jpeg -r 150 output.pdf slide
```

サブエージェントに以下を依頼：
```
Visually inspect these slides. Assume there are issues — find them.

Look for:
- Overlapping elements (text through shapes, lines through words)
- Text overflow or cut off at edges/box boundaries
- Elements too close (< 0.3" gaps) or cramped sections
- Uneven gaps or large empty areas
- Low-contrast text or icons
- Missing content

For each slide, list all issues found, even minor ones.

[画像パスリスト]
```

### 3-3. 修正→再確認ループ
問題を修正したら影響スライドを再レンダリングして必ず再確認する。
「問題なし」と言う前に少なくとも1回の修正→再確認を完了させる。

---

---

## 複合レイアウト：テンプレートを超える設計

**ビジネス資料では1スライドに情報を複数組み合わせる必要がある。テンプレートに縛られるな。**

テンプレートは「構造の骨格」を提供するが、目的によってはテンプレートを使わずに、または部分的に使いながら、pptxgenjsの生APIで直接組み立てる方が良い。

### いつテンプレートを「超える」か

| 状況 | 対応 |
|------|------|
| グラフ + その読み解きを1枚に | カスタム複合レイアウト |
| 2つのグラフを並べて比較 | カスタム複合レイアウト |
| 表 + ハイライト解説 | カスタム複合レイアウト |
| 数字3つ + それぞれの根拠 | bigStatテンプレート + カスタム追加 |
| フロー図 + 各ステップの補足コメント | flowHorizontal + カスタムオーバーレイ |

### 判断基準
- 「このスライドでユーザーに何を感じさせるか」が明確か？
- その感覚を出すのにテンプレート1つで足りるか？
- 足りないならどの要素を追加/組み合わせるか？

### 複合レイアウトのパターン

詳細なコード例 → `references/composite-layouts.md`

**パターン①: グラフ（左60%）+ インサイトパネル（右40%）**
```
[ヘッダー]
[ 棒グラフ        ][ ● ポイント1     ]
[               ][ ● ポイント2     ]
[               ][ → 結論メッセージ ]
```

**パターン②: 2グラフ並列 + 共通メッセージバー**
```
[ヘッダー]
[ グラフA（左） ][ グラフB（右） ]
[   ↑国内減少  ][  ↑インバウンド増加 ]
[ ━━━━ まとめメッセージ ━━━━ ]
```

**パターン③: 全幅グラフ + 下部コメントゾーン**
```
[ヘッダー]
[     大きなグラフ（全幅）     ]
[ コメント1 ][ コメント2 ][ コメント3 ]
```

**パターン④: テンプレート + カスタムオーバーレイ**
テンプレートを呼んだ後、`s.addShape()`/`s.addText()`でさらに要素を重ねる。
```javascript
T.horizontal3(pres, s, data, C);  // テンプレートで骨格
// さらに追加
s.addShape('rect', { x: ..., y: ..., ... });  // 吹き出し
s.addText('★ここがポイント', { ... });
```

---

## 重要な設計原則

1. **1スライド = 1主役の図** — 複数の図や大量のテキストは主役を殺す
2. **図は大きく・シンプル・3〜5秒で理解できる** — スライドの60〜70%を図が占めるくらいでちょうどいい
3. **テキストは図を補強する。図の代わりにはならない**
4. **アクセントラインをタイトル下に引かない** — AIらしさの典型。whitespaceで代替する
5. **NEVER use `#` in hex colors** — pptxgenjsでファイル破損の原因になる
6. **`mkShadow()`は毎回新規呼び出し** — オブジェクトの共有禁止（pptxgenjsが破壊的変更するため）

### チャート・グラフの設計原則

7. **データ量で差別化する** — テンプレートの最小限のデータ点に頼らない。プロフェッショナルなグラフは**データポイントが豊富**。例：4項目ではなく10-20項目。期間を伸ばして傾向を可視化する。小さな分母のデータも入れることで網羅性が上がる
8. **テンプレートを超える** — グラフスライドはテンプレート関数(`T.barChartSlide`等)ではなく**直接`addChart`で生成**する。これにより`valAxisMajorUnit`、`valAxisMinVal/MaxVal`、`lineDataSymbol`等の細かい制御が可能
9. **日本語チャートは`fix_chart_labels.py`必須** — EAフォント注入なしではPowerPointで□□□になる
10. **comparisonTableのheaders** — ラベル列名を含めない（テンプレートが自動追加するため余分な列ができる）

---

## 参考ファイル

- `references/template-catalog.md` — 全43テンプレートのAPI仕様と使用例
- `references/composite-layouts.md` — 複合レイアウトのコードパターン集（グラフ+解説、2グラフ並列、ポジショニングマップ等）
- `references/pitfalls.md` — 既知のバグと回避策（チャートラベル修正など）
- `references/template_showcase.pptx` — 全43テンプレートのショーケースPPTX（ダミーデータ使用。実在する企業名・個人名は含まない）
- `lib/slide-templates.js` — テンプレートライブラリ本体
- `../pptx/generate_showcase.js` — ショーケース生成スクリプト（参照用）
