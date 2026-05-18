# 网络搜索技能包（共享）

## 内置工具
| 工具 | 能力 |
|------|------|
| `web_search` | 搜索引擎查询 |
| `web_fetch` | 抓取网页内容（HTML→文本） |
| `browser` | 浏览器自动化操控 |

## web_search 用法
```
# 基础搜索
web_search: { query: "搜索关键词" }

# 技巧
- 用英文关键词搜技术问题
- 加 site:xxx.com 限定域名
- 加 "精确短语" 精确匹配
```

## web_fetch 用法
```
# 抓取网页
web_fetch: { url: "https://...", extractMode: "markdown" }

# 适用场景
- 读取文章/文档
- 抓取API文档
- 获取最新信息
```

## browser 用法
```
# 操作浏览器
browser: { action: "navigate", url: "..." }
browser: { action: "snapshot" }  # 获取页面结构
browser: { action: "screenshot" } # 截图
```

## 搜索策略
1. **先搜后读**：搜索 → 选结果 → 抓取内容
2. **多源验证**：同一问题查多个来源
3. **时效优先**：技术问题加年份
4. **英文兜底**：中文搜不到换英文

## 注意事项
- web_fetch 有字符限制，长文章需分段
- 动态页面用 browser 而非 web_fetch
- 遵守网站 robots.txt