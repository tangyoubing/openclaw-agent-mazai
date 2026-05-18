# Git版本控制技能包（共享）

## 基础配置
```bash
# 用户配置
git config user.name "用户名"
git config user.email "邮箱"

# 远程仓库
git remote add origin <url>
git remote set-url origin <url>  # 修改地址
```

## 常用命令
| 命令 | 用途 |
|------|------|
| `git status` | 查看变更 |
| `git add .` | 暂存所有 |
| `git commit -m "..."` | 提交 |
| `git push origin master` | 推送 |
| `git pull` | 拉取 |

## 远程仓库策略
```
主仓库（Gitee）  ← 默认push
备用仓库（GitHub） ← 主仓挂了切这个
```

## 多远程管理
```bash
# 查看所有远程
git remote -v

# 推送指定远程
git push gitee master
git push github master

# 添加备用远程
git remote add github <github-url>
```

## 常见问题
| 问题 | 解决 |
|------|------|
| 推送冲突 | `git pull --rebase` 再 push |
| 忘记添加文件 | `git add <file>` → `git commit --amend` |
| 回退版本 | `git reset --soft HEAD~1` |
| 网络不通 | 切备用仓库 |

## 注意事项
- 提交前检查是否有敏感信息
- Token 不要明文写在代码里
- 大文件用 .gitignore 排除