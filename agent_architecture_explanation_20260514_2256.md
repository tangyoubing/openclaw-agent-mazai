# Agent 架构说明 - 码仔的"大脑"在哪

## 任务目标
回答老板的问题：4个 Agent 的角色、知识库、记忆、技能存在哪里？如何保证迁移到其他软件后还是"训练好的样子"？

## 核心发现

### 1. 文件即记忆架构
每个 Agent 的所有"人格和记忆"都存储在文件系统中，没有数据库锁定。

**工作区结构：**
```
~/.qclaw/workspace-agent-113ca7a4/
├── IDENTITY.md      # 身份定义
├── SOUL.md          # 性格/风格
├── MEMORY.md        # 长期记忆
├── USER.md          # 用户信息
├── AGENTS.md        # 工作规范
├── TOOLS.md         # 工具配置
├── HEARTBEAT.md     # 心跳任务
└── memory/
    └── YYYY-MM-DD.md  # 每日日志
```

### 2. 四个 Agent 的隔离
- 码仔（agent-113ca7a4）
- 浣熊（agent-XXX）
- 作家（agent-XXX）
- 贾维斯（agent-XXX）

各自有独立 workspace，通过 agentId 区分。

### 3. 技能存储位置
- 内置技能：`F:\AI\Qclaw\resources\openclaw\config\skills`
- 管理技能：`~/.qclaw/skills`
- 工作区技能：`~/.openclaw/workspace/skills`

### 4. 迁移可行性分析

**可携带的（核心记忆）：**
- ✅ workspace-agent-XXX 目录（人格+记忆+规则）
- ✅ ~/.qclaw/skills/（自定义技能）
- ✅ openclaw.json 中的 agent 配置

**会丢失的（环境依赖）：**
- ⚠️ 内置技能需要新软件支持相同格式
- ⚠️ QQ/Feishu token 需要重新授权
- ⚠️ 某些工具依赖 QClaw 特定实现

## 结论

**当前架构优势：**
- 记忆已经文件化，易于备份和迁移
- 人格定义清晰，可移植性强

**改进方向：**
- 需要标准化导出格式（JSON/YAML）
- 技能需要解耦，支持跨平台安装
- 配置文件应该标准化，不绑死在 QClaw

## 下一步

如果需要，可以开发一个迁移脚本：
1. 打包 4 个 Agent 的核心文件
2. 导出为标准格式（包含 IDENTITY + SOUL + MEMORY）
3. 生成导入指南，方便迁移到其他软件

---

**生成时间：** 2026-05-14 22:56
**文件路径：** C:\Users\admin\.qclaw\workspace-agent-113ca7a4\agent_architecture_explanation_20260514_2256.md
