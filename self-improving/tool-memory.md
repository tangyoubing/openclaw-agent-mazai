# tool-memory.md — 工具使用经验

## 工具效果记录

### OpenClaw 配置管理
- `openclaw config set <path> <value>` — 修改配置（Gateway 会自动热加载）
- `openclaw config get <path>` — 查询配置
- `openclaw config validate` — 校验配置
- 直接编辑 JSON 文件会被覆盖，必须用 CLI 命令

### 搜索工具
- `web_search` — 需要配置 API Key，当前不可用
- `online-search (ProSearch)` — 可用，通过 `node prosearch.cjs --keyword=xxx` 调用
- `multi-search-engine` — 备选，多引擎并行

### 记忆检索
- `memory_search` — 语义搜索 MEMORY.md + memory/*.md
- `lcm_grep` — 搜索压缩后的对话历史
- `lcm_expand` — 展开压缩的摘要
- 三层记忆：工作记忆(上下文) → 压缩摘要(LCM) → 持久文件(MEMORY.md/memory/)
