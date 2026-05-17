# Python + API调用技能包（共享）

## Python简介
- 高级编程语言，简单易学
- 用途：自动化、爬虫、数据分析、AI

## API概念
- 应用程序接口，让程序之间互相通信

## requests库（HTTP请求）
```python
# 安装
pip install requests

# GET请求
import requests
response = requests.get('https://api.example.com/data')
print(response.status_code)  # 状态码
print(response.json())        # JSON响应

# POST请求
data = {'key': 'value'}
response = requests.post('url', json=data)
```

## 常用HTTP方法
| 方法 | 用途 |
|------|------|
| GET | 获取数据 |
| POST | 提交数据 |
| PUT | 更新数据 |
| DELETE | 删除数据 |

## 响应处理
- response.status_code → 状态码
- response.text → 原始文本
- response.json() → JSON解析

## 实际应用
- 调用火山方舟API
- 自动化网页数据抓取
- 对接第三方服务