# Claude Skills Library

Claude Code で使えるスキル集。[agent-skills.eudaimonia.co.jp](https://agent-skills.eudaimonia.co.jp) で公開中。

## インストール方法

各スキルは `npx degit` で1コマンドでインストールできます。

```bash
npx degit masa0827/claude-skills/<skill-name> /path/to/project/.claude/skills/<skill-name>
```

インストール後、そのプロジェクトの Claude Code からスキルが自動認識されます。

## スキル一覧

| スキル | 説明 | インストール |
|--------|------|-------------|
| [slide-creator](./slide-creator/) | PPTX形式のプレゼン資料・提案書を生成 | `npx degit masa0827/claude-skills/slide-creator .claude/skills/slide-creator` |
| [ai-writer](./ai-writer/) | AI臭ゼロの自然な日本語文章を生成 | `npx degit masa0827/claude-skills/ai-writer .claude/skills/ai-writer` |
| [x-research](./x-research/) | Grok x_searchでXのリアルタイム情報を収集しContext Packを生成 | `npx degit masa0827/claude-skills/x-research .claude/skills/x-research` |
| [storyboard-creator](./storyboard-creator/) | 動画企画からラフ絵コンテ生成用プロンプト（GPT Image 2向け）を組み立てる | `npx degit masa0827/claude-skills/storyboard-creator .claude/skills/storyboard-creator` |

## 動作要件

各スキルの `SKILL.md` に記載されています。`slide-creator` の場合:

- Node.js + `npm install pptxgenjs`
- Python 3
- LibreOffice（ビジュアルQA用）

## ライセンス

MIT
