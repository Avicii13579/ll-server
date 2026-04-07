# NestJS 的五层结构

NestJS 的完整请求处理流程如下。**这个顺序很重要**——理解这个顺序，就理解了 NestJS 的核心机制。

---

## 流程总览

```
HTTP 请求来了
    ↓
1. Middleware（中间件）
    ↓
2. Guard（守卫）——认证和授权检查
    ↓
3. Interceptor（拦截器）——请求前处理
    ↓
4. Pipe（管道）——数据验证和转换
    ↓
5. Controller（控制器）——处理请求
    ↓
6. Service（服务）——业务逻辑
    ↓
7. 返回响应
    ↓
8. Interceptor（拦截器）——响应后处理
    ↓
9. 异常过滤器——处理错误
    ↓
HTTP 响应返回给客户端
```

---

## 各阶段说明

| 顺序 | 组件 | 作用 |
|------|------|------|
| 1 | **Middleware** | 中间件：在路由处理前执行，可做日志、CORS、体解析等横切逻辑。 |
| 2 | **Guard** | 守卫：在路由处理器执行前判断「能否进入该路由」，常用于认证、授权、角色校验。 |
| 3 | **Interceptor（前）** | 拦截器：请求阶段可改写请求、记录时间、注入上下文等。 |
| 4 | **Pipe** | 管道：对入参做校验（ValidationPipe）与转换（类型转换、默认值等）。 |
| 5 | **Controller** | 控制器：解析 HTTP 参数，调用对应 Service，组织返回。 |
| 6 | **Service** | 服务：承载业务逻辑，与数据库、外部 API 等交互。 |
| 7 | — | 业务返回数据，进入响应链路。 |
| 8 | **Interceptor（后）** | 拦截器：对返回值做包装、日志、缓存、超时等响应侧处理。 |
| 9 | **Exception Filter** | 异常过滤器：将抛出的异常映射为统一的 HTTP 状态码与响应体。 |

> **说明**：异常可能在 Controller / Service 任意阶段抛出；过滤器负责在响应写出前捕获并格式化。正常路径下，响应经拦截器后返回客户端。

---

## 复习要点

1. **入站顺序**：Middleware → Guard → Interceptor（before）→ Pipe → Controller → Service。  
2. **出站顺序**：Service 返回 → Interceptor（after）→ 若有异常则 Exception Filter。  
3. **职责划分**：Guard 管「能不能进」，Pipe 管「数据对不对」，Service 管「业务怎么做」，Interceptor 常管「横切增强」，Filter 管「错误怎么暴露给客户端」。
