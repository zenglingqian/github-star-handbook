# 登录令牌请求链路示例

这个项目提供一个可运行的 Node.js 应用服务器，包含登录端点和受 Bearer JWT 保护的后端接口。只使用 Node.js 内置模块，无需安装依赖。

## 启动

```powershell
cd outputs/auth-token-demo
node server.js
```

浏览器访问 http://localhost:3000 。默认演示账号：`demo` / `demo1234`。

可通过环境变量调整端口、演示账号、密码和签名密钥：

```powershell
$env:PORT="3000"
$env:DEMO_USER="demo"
$env:DEMO_PASSWORD="demo1234"
$env:JWT_SECRET="replace-with-a-long-random-secret"
node server.js
```

## 组件

- `server.js`：Node HTTP 应用服务器；实现 `POST /api/login` 和 `GET /api/profile`。
- `public/index.html`：登录表单、令牌内存状态，以及调用受保护接口的前端代码。
- `package.json`：启动脚本和 Node.js 版本要求。

## 请求流程

1. 前端向 `POST /api/login` 发送 JSON `{ "username": "demo", "password": "demo1234" }`。
2. 服务端验证凭据，成功后生成 HS256 JWT，响应包含 `access_token`、`token_type` 和 `expires_in`。
3. 浏览器只在当前页面内存中保存访问令牌；刷新或关闭页面会清除它。
4. 前端请求 `GET /api/profile`，附带 `Authorization: Bearer <access_token>`。
5. 服务端校验签名和 `exp`，有效时返回数据，无效或过期则返回 HTTP 401。

## curl 示例

```sh
curl -i -X POST http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"demo","password":"demo1234"}'

curl -i http://localhost:3000/api/profile \
  -H 'Authorization: Bearer <上一步响应中的 access_token>'
```

## 凭据和令牌处理

- 登录凭据通过 HTTPS（生产环境）传输；此本地示例使用 HTTP。
- 示例账号由服务端环境变量配置；没有把密码放进浏览器代码。
- JWT 由服务端 HMAC-SHA256 签名，有效期 15 分钟。签名密钥只在服务器端，绝不能发给客户端。
- 示例前端把访问令牌存在 JavaScript 内存，不写入 `localStorage` 或 URL；登出时清除内存副本。
- JWT 是签名而非加密，令牌载荷可被读取，不要把密码或敏感数据放入载荷。
- 这是教学示例：真实部署还需要数据库用户、密码哈希（如 Argon2id/bcrypt）、登录限流、HTTPS、密钥轮换和适当的会话撤销机制。
