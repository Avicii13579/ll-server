# JWT 认证流程

当用户发送请求时，后端的 JWT 认证处理流程如下：

```mermaid
flowchart TD
    Step1[1. 用户发送请求<br>GET /user/info<br>Headers: Authorization: Bearer Token] --> Step2[2. Passport JWT Strategy 拦截请求]
    Step2 --> Step3[3. 从 Authorization 头提取 Token]
    Step3 --> Step4[4. 用 secretOrKey 验证签名<br>检查签名是否有效]
    Step4 --> Step5[5. 签名有效？检查过期时间]
    Step5 --> Step6[6. 没有过期？<br>从 Payload 中提取用户信息]
    Step6 --> Step7[7. 调用 validate() 方法<br>返回用户信息]
    Step7 --> Step8[8. 把用户信息放在 request.user]
    Step8 --> Step9[9. 请求继续传递给 Controller]
```

## 详细步骤

1. **用户发送请求**
   - 客户端发起请求，例如 `GET /user/info`
   - 在请求头中携带 Token：`Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiI...`

   ↓

2. **Passport JWT Strategy 拦截请求**
   - 框架的 Auth Guard（如 `@UseGuards(JwtAuthGuard)`）触发 `JwtStrategy` 拦截该请求。

   ↓

3. **从 Authorization 头提取 Token**
   - 策略自动从 `Bearer` 后面提取出具体的 JWT 字符串 `eyJhbGciOiJIUzI1NiI...`。

   ↓

4. **用 secretOrKey 验证签名**
   - 使用服务器配置的密钥（Secret）对 Token 进行解码和签名验证，检查签名是否被篡改。

   ↓

5. **签名有效？检查过期时间**
   - 确认 Token 尚未过期（校验 `exp` 字段）。

   ↓

6. **没有过期？从 Payload 中提取用户信息**
   - 如果校验全部通过，解析出 Token Payload 中携带的用户基础信息（例如 `userId`, `username` 等）。

   ↓

7. **调用 `validate()` 方法**
   - 触发我们在 `JwtStrategy` 中定义的 `validate(payload)` 方法，并返回所需的用户数据。

   ↓

8. **把用户信息放在 `request.user`**
   - Passport 会自动将 `validate()` 方法的返回值挂载到 `request.user` 对象上。

   ↓

9. **请求继续传递给 Controller**
   - 认证通过，请求被放行到对应的控制器方法中。在 Controller 中可以通过 `@Req() req` 或者自定义装饰器直接获取到 `req.user`。
