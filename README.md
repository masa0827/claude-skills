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

## 動作要件

各スキルの `SKILL.md` に記載されています。`slide-creator` の場合:

- Node.js + `npm install pptxgenjs`
- Python 3
- LibreOffice（ビジュアルQA用）

## ライセンス

MIT
