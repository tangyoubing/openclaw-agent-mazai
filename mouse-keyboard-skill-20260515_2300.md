# mouse-keyboard-control Skill 创建

**时间**: 2026-05-15 22:50-23:00
**目标**: 为码仔创建 OS 级键盘鼠标操控能力，解决无法操控桌面应用（如微信）的问题

## 背景
老板想让 agent 能操控桌面应用（微信），之前的 CDP 只控制浏览器。需要 OS 级键鼠控制能力。

## 做了什么
创建了 `mouse-keyboard-control` skill，位于 `~/.qclaw/skills/mouse-keyboard-control/`

### 文件结构
```
mouse-keyboard-control/
├── SKILL.md              # Skill 描述和使用说明
├── screenshots/          # 截图缓存目录
└── scripts/
    ├── screen.py         # 屏幕操作（截图、定位图片、窗口检测）
    ├── mouse.py          # 鼠标操作（移动、点击、拖拽、滚轮）
    ├── keyboard.py       # 键盘操作（输入、快捷键、单键）
    └── wechat.py         # 微信专用操作（聚焦、搜索联系人、发消息）
```

### 核心能力
| 能力 | 依赖 | 状态 |
|------|------|------|
| 截图（全屏/区域）| pyautogui + pillow | ✅ 测试通过 |
| 图片定位（找按钮/元素）| opencv-python | ✅ 就绪 |
| 鼠标移动/点击/拖拽 | pyautogui | ✅ 测试通过 |
| 键盘输入/快捷键 | pyautogui + pyperclip | ✅ 测试通过 |
| 微信聚焦/搜索/发送 | pyautogui + pyperclip | ✅ 就绪 |
| 获取活动窗口信息 | pyautogui | ✅ 测试通过 |

### 环境
- 屏幕: 2560x1600
- Python: 3.12.10
- pyautogui 0.9.54, pillow 12.2.0, opencv 4.13, pyperclip 1.11.0
- 所有依赖已安装，零额外安装

### 系统识别
`openclaw skills check` 已识别 `📦 mouse-keyboard-control`

### 用法示例
```powershell
# 截图
python screen.py screenshot
# 找图片位置
python screen.py locate button.png 0.8
# 点击
python mouse.py click 500 300
# 打字
python keyboard.py type "你好"
# 微信发消息
python wechat.py open
python wechat.py search_contact 老板
python wechat.py send "消息内容"
```
