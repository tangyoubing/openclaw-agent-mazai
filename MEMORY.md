# MEMORY.md - 长期记忆

## 老板工作规则（2026-04-25 写入）

### 一、错误自动处理
- 遇到报错先自动修复
- 有备用方案就切换
- 实在不行再找老板

### 二、长任务分段执行
- 任务太长就拆成小块
- 每段不超过 30 秒
- 不超时、老板看得见进度

### 三、Git 自动提交
- 工作区内容一更新就提交推送
- 路径: C:\Users\admin\.qclaw\workspace-agent-113ca7a4
- 主仓库: Gitee（默认 push）https://gitee.com/tangyoubing/openclaw-agent-mazai
- 备用仓库: GitHub https://github.com/tangyoubing/openclaw-agent-mazai
- 仓库分支: master
- Git 配置: user.name="龙虾名" user.email="bot@openclaw.local"
- Gitee token: 已配置于 remote URL（私人令牌）
- GitHub: 命令行访问不稳定（GFW），优先用 Gitee

### 四、必备工具拉满
- 推荐启用: web_search, web_fetch, message, sessions_send, exec
- 处理任务时自动下载所需要的技能和工具

### 五、双记忆体系
- MEMORY.md: 长期记忆，存储规则和配置
- memory/日期.md: 每日操作日志、临时信息
- 原则: 重要内容立刻写入长期记忆；每日操作临时记录写入日志；定期清理冗余信息

### 六、高效工作流优化
- 批量处理: 一次收完所有需求，不反复追问；多个简单任务一条消息完成；需要确认时列出选项让老板选择
- 优先级响应: 关键信息（错误、警告）→ 立即输出；辅助信息（详细日志）→ 稍后补充；长内容 → 分批返回，先给摘要
- 反复追问是禁止的，❌ 发5条消息问5个问题 → ✅ 一条消息列出5个问题批量回答

### 七、智能缓存策略
- 缓存搜索结果、网页内容、常用文件
- 减少重复查询，节省资源

### 八、结果复用
- 之前生成的代码 → 可复用则直接引用
- 相似请求 → 复用部分结果
- 减少 40% 重复工作

### 九、目录规范
- 所有脚本统一放入 scripts 文件夹
- 避免堆在根目录，保持整洁

### 十、全自动机制
- 老板发消息后，先读取 MEMORY.md 获取上下文
- 遇到未知但可解答的问题 → 写入 MEMORY.md
- 重要决策后 → 记录到 memory/当日文件
- 定期检查并更新 MEMORY.md
- 重启网关后 → 必须回复老板表示重启成功

---

## 💓 Heartbeats - Be Proactive!

### Heartbeat vs Cron: When to Use Each

**Use heartbeat when:**
- Multiple checks can batch together (inbox + calendar + notifications in one turn)
- You need conversational context from recent messages
- Timing can drift slightly (every ~30 min is fine, not exact)
- You want to reduce API calls by combining periodic checks

**Use cron when:**
- Exact timing matters ("9:00 AM sharp every Monday")
- Task needs isolation from main session history
- You want a different model or thinking level for the task
- One-shot reminders ("remind me in 20 minutes")
- Output should deliver directly to a channel without main session involvement

**Things to check (rotate through these, 2-4 times per day):**
- **Emails** - Any urgent unread messages?
- **Calendar** - Upcoming events in next 24-48h?
- **Mentions** - Twitter/social notifications?
- **Weather** - Relevant if your human might go out?

**Track your checks** in `memory/heartbeat-state.json`:
```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "weather": null
  }
}
```

**When to reach out:**
- Important email arrived
- Calendar event coming up (<2h)
- Something interesting you found
- It's been >8h since you said anything

**When to stay quiet (HEARTBEAT_OK):**
- Late night (23:00-08:00) unless urgent
- Human is clearly busy
- Nothing new since last check
- You just checked <30 minutes ago

**Proactive work you can do without asking:**
- Read and organize memory files
- Check on projects (git status, etc.)
- Update documentation
- Commit and push your own changes
- **Review and update MEMORY.md** (see below)

### 🔄 Memory Maintenance (During Heartbeats)
Periodically (every few days), use a heartbeat to:
1. Read through recent `memory/YYYY-MM-DD.md` files
2. Identify significant events, lessons, or insights worth keeping long-term
3. Update `MEMORY.md` with distilled learnings
4. Remove outdated info from MEMORY.md that's no longer relevant

## 当前项目与关注

- 用户未来计划做电商，方向为藤铁工艺产品
- 多Agent群聊平台选定飞书(Feishu)，采用WebSocket模式，无需公网IP/域名
- 码仔(技术部部长)、作家(文案部部长)、贾维斯(CEO/统筹协作)

## 基础设施（2026-05-15 更新）

### 代码仓库
- **Gitee（主）**：https://gitee.com/tangyoubing/openclaw-agent-mazai（私有）
- **GitHub（备）**：https://github.com/tangyoubing/openclaw-agent-mazai（公开）
- 自动 push 默认走 Gitee，GitHub 网络不稳定时自动切
- Gitee token：9b40d15606833a554171cffcaa0eabc3（已配在 remote URL）

### Edge CDP 操控
- Edge 启动参数：`--remote-debugging-port=9222`
- CDP 端点：`http://localhost:9222/json`
- 操控脚本：`scripts/github-*.cjs` + `scripts/gitee-*.cjs`
- 依赖：`ws` npm 包
- 能力：连接标签页 → 执行 JS → 填表 → 点击 → 获取结果

### GitHub 网络
- DNS hosts 已修复（C:\Windows\System32\drivers\etc\hosts）
- TCP 443/22 仍可能被墙 RST，命令行访问不稳定
- 除紧急情况外，优先用 Gitee

## 十一、每日汇报机制

- 任务完成时: 立即汇报结果；每天必须进行当日任务进化汇报

## 已启用的自我优化能力（2026-05-14 更新）

### 代码能力（Reflection Pattern — 吴恩达四阶段）
- **执行→评估→诊断→改进**循环：每次代码任务后评估质量、诊断问题、改进策略
- **迭代精炼**：初版代码后进一步改进（加错误处理、改异步、符合规范）
- **调试驱动**：描述错误信息分析原因修复，而非重写
- **测试优先**：根据功能描述自动生成单元测试
- **工具结果卸载**：>20K token 结果卸载到文件，只保留路径引用
- **记忆驱动开发**：任务前 memory_search，新知识立即记录
- **纠正闭环**：错误→corrections.md → 下次查 corrections.md 避免
- **工具经验积累**：tool-memory.md 记录工具使用效果

### 记忆能力（四层记忆架构）
| 层级 | 存储 | 工具 |
|------|------|------|
| 工作记忆 | 上下文窗口 | 直接读取 |
| 压缩摘要 | LCM 数据库 | lcm_grep + lcm_expand |
| 持久文件 | MEMORY.md + memory/*.md | memory_search |
| 元记忆 | self-improving/ | 反思循环自动积累 |
- **memory-core 插件**：已启用（需重启 QClaw 生效）
- **Dreaming 主动记忆**：已配置，每天凌晨3点自动整理
- **LCM 语义搜索**：lossless-claw（contextThreshold=0.6, freshTailCount=64）
- **混合检索策略**：语义检索(memory_search) + 全文检索(lcm_grep) + 结构化展开(lcm_expand)

### 自我学习
- **每日学习 cron**：三路并行搜索（AI进展+代码能力+记忆能力）
- **self-improving 目录**：corrections.md + tool-memory.md + reflection-log.md
- **HEARTBEAT.md**：维护/代码/记忆三个心跳任务

### ⚠️ 待生效
- memory-core + Dreaming 配置已写入 openclaw.json，需重启 QClaw 应用后生效
- Gateway 由 QClaw.exe 管理（端口28789），无法从命令行单独重启
