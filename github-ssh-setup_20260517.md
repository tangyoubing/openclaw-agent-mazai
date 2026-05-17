# GitHub SSH 连接方案（2026-05-17）

## 目标
解决 GitHub HTTPS 端口 443 被 GFW RST 阻断的问题，实现稳定连接。

## 诊断
| 检测项 | 结果 | 说明 |
|--------|------|------|
| DNS 解析 | ✅ | hosts 已配 IP 20.205.243.166 |
| ICMP Ping | ✅ | 74ms 延迟 |
| TCP 443 (HTTPS) | ❌ | 被 GFW RST |
| TCP 22 (SSH) | ✅ | 畅通 |

## 方案选择
最优方案：SSH 协议直连（22 端口未被阻断，零成本零依赖）

## 执行步骤
1. ✅ 生成 RSA 4096 SSH Key（`C:\Users\admin\.ssh\id_rsa`）
2. ✅ 修改 Git remote origin 为 SSH 地址
3. ⏳ 等待用户添加公钥到 GitHub（https://github.com/settings/keys）
4. ⏳ 验证连接 `ssh -T git@github.com`

## 备选方案（如 SSH 也不可用）
- 代理：`git config --global http.https://github.com.proxy socks5://127.0.0.1:1080`
- 镜像站：ghproxy.com / gitclone.com
- Cloudflare Worker 反代
