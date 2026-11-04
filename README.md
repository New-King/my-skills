# my-skills

个人 DeepSeek Harness skill 集合。

## Skills

- [topic-explainer-video](skills/topic-explainer-video/SKILL.md) — 给一个主题，直接做成 30 秒中文科普短片（配音、词级字幕、BGM、Remotion 源码）。

## 目录约定

```text
skills/
  <skill-name>/
    SKILL.md
    ...          # 模板、脚本、参考资料
```

每个 skill 名使用 kebab-case，必须有 `SKILL.md`，frontmatter 至少包含 `name` 和 `description`。

## 安装到 DSH

DSH 会扫描 `~/.dsh/skills`。运行：

```bash
./install.sh
```

脚本会把 `skills/*` 链接到 `${DSH_HOME:-$HOME/.dsh}/skills/`。已经存在的真实目录不会被覆盖，只会跳过。

## 新增 skill

1. 在 `skills/` 下创建 `<skill-name>/SKILL.md`。
2. 本地验证 frontmatter 和触发描述。
3. `git add`、`git commit`、`git push`。
