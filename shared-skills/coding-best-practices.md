# 编码最佳实践技能包（共享）

## 代码质量四步法（Reflection Pattern）
```
执行 → 评估 → 诊断 → 改进
```

## 基本原则
| 原则 | 说明 |
|------|------|
| DRY | 不重复写相同逻辑 |
| KISS | 保持简单，不过度设计 |
| 单一职责 | 一个函数只做一件事 |
| 错误处理 | 永远考虑异常情况 |

## 异步编程
```javascript
// Node.js 异步模式
async function main() {
  try {
    const result = await someAsyncOp();
    return result;
  } catch (err) {
    console.error('失败:', err.message);
    throw err;
  }
}
```

## 代码改进清单
- [ ] 是否有重复代码可提取？
- [ ] 错误处理是否完善？
- [ ] 变量命名是否清晰？
- [ ] 有无硬编码值？（应提取为配置）
- [ ] 异步操作是否有超时机制？

## 调试技巧
1. 先读错误信息（仔细看堆栈）
2. 定位出错行号
3. 分析原因而非改症状
4. 修复后验证

## 版本管理
- 小步提交（一个功能一次commit）
- commit message 写明改了什么
- 不提交 node_modules、.env、token

## 性能优化
| 层级 | 方法 |
|------|------|
| 算法 | 选对数据结构 |
| 内存 | 避免泄漏，及时释放 |
| IO | 批量操作，减少往返 |
| 缓存 | 计算结果复用 |