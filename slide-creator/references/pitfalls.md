# Known Pitfalls & Fixes

slide-templates.js と pptxgenjs の既知バグ・落とし穴。制作前に必ず確認する。

---

## pptxgenjs 全般

### 1. チャートのX軸ラベルがPowerPointで数値になる【必須修正】
**症状**: LibreOfficeでは正常に表示されるが、PowerPointで開くと「1」「2」「3」と数値になる  
**原因**: pptxgenjsは `<c:multiLvlStrRef>` を生成するが、PowerPointは `<c:strRef>` + `<c:strCache>` を期待する  
**修正**: `fix_chart_labels.py` を `pres.writeFile()` 後に必ず実行する

```javascript
const { execFileSync } = require('child_process');
pres.writeFile({ fileName: outFile })
  .then(() => {
    execFileSync('python', [
      '{{SKILL_DIR}}/lib/scripts/fix_chart_labels.py',
      outFile
    ], { stdio: 'inherit' });
  });
```

### 2. hex colorに`#`をつけない
```javascript
color: "FF0000"   // ✅ 正しい
color: "#FF0000"  // ❌ ファイル破損
```

### 3. 8桁hexは透明度に使えない
```javascript
// ❌ ファイル破損
shadow: { color: "00000020", ... }

// ✅ opacityを使う
shadow: { color: "000000", opacity: 0.12, ... }
```

### 4. mkShadow()は毎回新規呼び出し
pptxgenjsはオブジェクトを破壊的に変更（EMU変換等）するため、同じオブジェクトを複数のshapeに使いまわすと2回目以降が壊れる。

```javascript
// ❌ 共有禁止
const shadow = { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 };
s.addShape('rect', { shadow, ... });
s.addShape('rect', { shadow, ... });  // 壊れる

// ✅ 毎回新規
const mkShadow = () => ({ type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.08 });
s.addShape('rect', { shadow: mkShadow(), ... });
s.addShape('rect', { shadow: mkShadow(), ... });
```

### 5. LAYOUT_WIDEは使わない
- `LAYOUT_16x9` = 10"×5.625" ← これだけ使う
- `LAYOUT_WIDE` = 13.3"×7.5" ← 禁止。テンプレートの全座標がずれる

### 6. チャートのcatAxisTitle / showCatNameに注意
```javascript
// ❌ 除去する（catAxisに干渉してラベル表示が壊れる）
catAxisTitle: '',
showCatName: false,

// ✅ catAxisLabelFontSizeだけ使う
catAxisLabelFontSize: 12,
```

---

## slide-templates.js のAPI注意点

### T.cover() にtagsは渡せない
```javascript
// ❌ tagsは未実装パラメータ。無視される
T.cover(pres, s, { title: '...', tags: ['調査報告', '提案'] }, C);

// ✅ cover呼び出し後にカスタムで描画する
T.cover(pres, s, { title: '...', ... }, C);
const tags = ['調査報告', '提案', '次の打ち手'];
tags.forEach((tag, i) => {
  s.addShape('rect', { x: 0.5 + i * 2.0, y: 4.8, w: 1.8, h: 0.4, fill: { color: C.teal }, ... });
  s.addText(tag, { x: 0.5 + i * 2.0, y: 4.8, w: 1.8, h: 0.4, ... });
});
```

### T.closing() のパラメータ名
```javascript
// ❌ message/contactは無効
T.closing(pres, s, { message: '...', contact: '...' }, C);

// ✅ items:[{text}] と companyInfo を使う
T.closing(pres, s, {
  title: 'まずは一歩',
  items: [
    { text: '30分のオンライン相談' },
    { text: 'ヒアリング' },
  ],
  companyInfo: 'Your Company / info@example.com',
}, C);
```

### T.grid2x2() のアイテムキー
```javascript
// ❌ titleキーは無効
items: [{ title: '見出し', body: '...' }]

// ✅ labelキーを使う
items: [{ label: '見出し', body: '...' }]
```

### T.addHeader() / T.addFooter() はpres引数なし
```javascript
// ❌ pres引数を渡すとエラー
T.addHeader(pres, s, title, sub, C);

// ✅ sから始まる
T.addHeader(s, title, sub, C);
T.addFooter(s, num, total, label, C);
```

---

## 既知の未解決バグ

### matrix2x2 の yLabel
縦軸ラベル（yLabel）は配置が難しく、完全対応していない。
**推奨**: yLabelは使わない。xLabelだけ使う。

### treeChart の子ノード4以上
子ノードが4以上になると、上半分の接続線（h<0）が描画されない場合がある。
**推奨**: 子ノードは3つ以内に抑えるか、describe-onlyにする。

---

---

## チャートの日本語文字化け（PowerPoint）【必須対応】

**症状**: LibreOfficeでは日本語が正常表示されるが、PowerPointでチャートのX軸ラベル等が□□□になる  
**原因**: pptxgenjsは`<a:latin>`のみ出力し、PowerPointがCJK文字に必要な`<a:ea>`（East Asian font）を出力しない  
**修正**: `fix_chart_labels.py`が自動で以下を注入する（2026-04-07追加済み）:
- `<a:ea typeface="Yu Gothic UI"/>` — 東アジアフォント
- `<a:cs typeface="Yu Gothic UI"/>` — Complex Scriptフォント
- `lang="ja-JP"` — 言語設定

**注意**: `fix_chart_labels.py`は全チャートXML（`multiLvlStrRef`の有無に関わらず）を処理する。円グラフ等もフォント注入が必要。

---

## comparisonTable の headers にラベル列名を入れない

**症状**: 表の列がずれる（余分な空列ができる）  
**原因**: テンプレートが`headerRow`の先頭に自動で空の`hdr('')`を追加する（line 274）。headersにラベル列名を含めると列が1つ余分にできる  
**正しい使い方**:
```javascript
// ❌ headers[0]にラベル列名を入れる → 4列になりズレる
headers: ['国', '立場', '主な行動']

// ❌ 空文字列を入れても同じ問題
headers: ['', '立場', '主な行動']

// ✅ データ列名だけを入れる → 正しく3列
headers: ['立場', '主な行動']
```

---

## グラフ設計の原則

**テンプレートのデフォルト設定に頼らず、直接`addChart`でプロフェッショナルなグラフを作る:**

1. **データ量を増やす** — 4項目ではなく10-20項目。期間を伸ばして傾向を可視化
2. **Y軸を適切に設定** — `valAxisMajorUnit`で細かい目盛り、`valAxisMinVal/MaxVal`でデータ範囲に合わせて差を強調
3. **フォント指定** — `catAxisLabelFontFace: 'Yu Gothic UI'` を必ず指定（fix_chart_labels.pyのバックアップ）
4. **マーカー** — 折れ線には`lineDataSymbol: 'circle'`でデータポイントを明示
5. **凡例** — `legendFontFace: 'Yu Gothic UI'`で日本語を確実に

---

## QAチェックリスト

- [ ] チャートを使った場合、fix_chart_labels.pyを実行したか
- [ ] hex colorに`#`が混入していないか
- [ ] mkShadow()をオブジェクト共有していないか
- [ ] `LAYOUT_WIDE`を使っていないか（LAYOUT_16x9のみ）
- [ ] T.cover()でtagsを渡していないか
- [ ] T.closing()でmessage/contactを使っていないか
- [ ] T.addHeader/addFooterにpresを渡していないか
- [ ] comparisonTableのheadersにラベル列名を入れていないか
- [ ] チャートラベルに日本語を使った場合、PowerPointでの表示を確認したか
- [ ] グラフのデータポイントは十分か（テンプレのデフォルトに頼らない）
- [ ] LibreOfficeでビジュアルQAを完了したか
