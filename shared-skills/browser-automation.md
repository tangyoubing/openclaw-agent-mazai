# 浏览器自动化技能包（共享）

## 工具
- OpenClaw 内置 `browser` 工具
- 基于 Chromium CDP 协议

## 启动浏览器
```
# Edge CDP模式
msedge.exe --remote-debugging-port=9222

# 连接端点
http://localhost:9222/json
```

## 核心操作
| 操作 | 说明 |
|------|------|
| navigate | 打开URL |
| snapshot | 获取页面结构 |
| screenshot | 截图 |
| act: click | 点击元素 |
| act: type | 输入文字 |
| act: evaluate | 执行JS |

## 常用场景
```
1. 网页填表提交
2. 数据采集爬取
3. 自动化测试
4. 截图留存
```

## CDP脚本示例
```javascript
// Node.js CDP连接
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9222/...');
ws.on('message', data => {
  // 处理CDP消息
});
```

## 注意事项
- 先启动浏览器再操作
- snapshot 获取 ref 再点击
- 等待页面加载完成（loadState）
- 动态内容用 wait 而非 sleep
- 生产环境用 headless 模式