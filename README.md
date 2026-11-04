# my-skills

个人常用 skills 集合。

## Skills

- [topic-explainer-video](skills/topic-explainer-video/SKILL.md) — 给一个主题，直接做成 30 秒中文科普短片（配音、词级字幕、BGM、Remotion 源码）。
- [github-repo](skills/github-repo/SKILL.md) — 用 curl 调 GitHub API 新建远程仓库（钥匙串取 token，默认 public）。

## 目录约定

```text
skills/
  <skill-name>/
    SKILL.md
    ...          # 模板、脚本、参考资料
```

每个 skill 名使用 kebab-case，必须有 `SKILL.md`，frontmatter 至少包含 `name` 和 `description`。

## 新增 skill

1. 在 `skills/` 下创建 `<skill-name>/SKILL.md`。
2. 本地验证 frontmatter 和触发描述。
3. `git add`、`git commit`、`git push`。
