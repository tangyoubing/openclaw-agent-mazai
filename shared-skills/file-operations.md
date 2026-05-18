# 文件操作技能包（共享）

## 工具
- `read`：读取文件
- `write`：写入文件
- `edit`：精确替换编辑

## read 用法
```
# 读取文本
read: { path: "文件路径" }

# 大文件分段读取
read: { path: "...", offset: 100, limit: 50 }
```

## write 用法
```
# 写入新文件（自动创建目录）
write: { path: "...", content: "内容" }

# 覆盖已有文件（需确认重要文件）
```

## edit 用法
```
# 精确替换
edit: {
  path: "...",
  edits: [{ oldText: "旧内容", newText: "新内容" }]
}
```

## 路径规范
| 路径类型 | 示例 |
|----------|------|
| 绝对路径 | `C:\Users\admin\workspace\file.txt` |
| 相对路径 | `scripts/tool.cjs` |
| 工作区 | `C:\Users\admin\.qclaw\workspace-agent-113ca7a4` |

## 最佳实践
- 脚本统一放 `scripts/` 目录
- 大文件(>50KB)分段读取
- 编辑用 edit 而非整文件重写
- 删除优先用 trash 而非 rm