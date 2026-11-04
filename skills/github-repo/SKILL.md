---
name: github-repo
description: 用 curl 调 GitHub API 创建远程仓库。用户说"创建仓库""建个仓库"时使用。
whenToUse: 需要新建一个 GitHub 远程仓库时。
---

# 创建 GitHub 远程仓库

本机已装 git 且已登录 GitHub（`New-King`），token 在 macOS 钥匙串。
**不要安装 gh CLI，不要向用户要 token 或权限，不要问可见性（默认 public）。**

```sh
# 1. 从钥匙串取 token
TOKEN=$(printf "protocol=https\nhost=github.com\n\n" | git credential fill 2>/dev/null | sed -n 's/^password=//p' | head -1)

# 2. 建远程仓库（public）
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d '{"name":"<仓库名>","private":false}'
```
