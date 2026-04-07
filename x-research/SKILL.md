---
name: x-research
description: xAI (Grok) の x_search を使い、X(Twitter) のリアルタイム情報を検索・収集して Context Pack を生成するリサーチスキル。
---

# X Research — Grok x_search リサーチスキル

## Overview

AIでリサーチする際、X（Twitter）のリアルタイム情報の取得は精度が低い。
このスキルは **Grok (xAI API) を「X検索専用レイヤー」** として使い、記事執筆・コンテンツ作成の前工程で一次情報/用語/反論/数字を揃えた **Context Pack** を生成する。

## Prerequisites

- Node.js がインストールされていること
- `tsx` で TypeScript を実行できること（`package.json` に含まれる）
- xAI API Key を取得していること（[x.ai](https://x.ai/) で取得、従量課金 約$0.1/回）

## Setup

1. 依存パッケージをインストール:
```bash
cd {{SKILL_DIR}}
npm install
```

2. `.env` ファイルを作成して xAI API Key を設定:
```bash
cp .env.example .env
# .env を編集して XAI_API_KEY を設定
```

## When To Use

- 記事やXポストのネタについて、Xでのリアルタイムな反応・議論を調べたい
- 特定のトピックについて、一次情報・用語定義・反論を揃えたい
- トレンドや最新の技術動向をX上で把握したい
- `$article-agent-outliner` の前に材料を揃えたい

## Usage (CLI)

```bash
cd {{SKILL_DIR}}
npx tsx scripts/grok_context_research.ts --topic "調べたいトピック"
```

### Options

| オプション | 説明 | デフォルト |
|---|---|---|
| `--topic TEXT` | リサーチしたいトピック（**必須**） | — |
| `--locale ja\|global` | 検索言語圏 | `ja` |
| `--audience engineer\|investor\|both` | 想定読者 | `engineer` |
| `--goal "..."` | リサーチの目的 | 周辺情報リサーチ |
| `--days N` | 検索対象の日数 | `30` |
| `--out-dir DIR` | 出力ディレクトリ | `data/context-research` |
| `--dry-run` | リクエストペイロードを表示して終了 | — |
| `--raw-json` | レスポンスJSONも出力 | — |

### Examples

```bash
# 日本語圏でAI関連トピックを検索
npx tsx scripts/grok_context_research.ts --topic "Claude Codeの最新活用事例"

# グローバルに検索、投資家向け
npx tsx scripts/grok_context_research.ts --topic "xAI valuation 2026" --locale global --audience investor

# ドライラン（API呼び出しなし）
npx tsx scripts/grok_context_research.ts --topic "テスト" --dry-run
```

## Output

`data/context-research/` に以下が保存される:

- `YYYYMMDD_HHMMSSZ_context.md` — Context Pack 本体
- `YYYYMMDD_HHMMSSZ_{locale}_context.json` — リクエスト/レスポンス/パラメータ
- `YYYYMMDD_HHMMSSZ_{locale}_context.txt` — 抽出テキスト

### Context Pack の構成

- **Meta**: タイムスタンプ、トピック、想定読者
- **Topic**: 1文の要約
- **Why Now**: なぜ今このトピックか（3点）
- **Key Questions**: 主要な問い（5-8個）
- **Terminology / Definitions**: 用語定義（出典あり）
- **Primary Sources**: 公式ドキュメント等のURL
- **Secondary Sources**: X投稿等のURL
- **Contrasts / Counterpoints**: 反論・注意点
- **Data Points**: 数字データ（日付・出典あり）
- **What We Can Safely Say / What We Should Not Say**: 言える/言えないこと
- **Suggested Angles**: 記事の切り口（3案）
- **Outline Seeds**: 見出し案（3-6個）

## Notes

- 一次情報の優先度: 公式 > 公式GitHub/実装 > 信頼できる二次情報
- 数字/仕様/制限は「As of（参照日）」を付ける
- 長文の直接引用は避ける（要旨 + URL）
- X投稿URLは Secondary 扱い
