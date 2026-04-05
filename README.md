# ll-server

NestJS 创建的 Server 项目

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 项目介绍

基于 [Nest](https://github.com/nestjs/nest) 框架的 TypeScript 后端项目。

## 项目安装

```bash
$ pnpm install
```

## 编译和运行项目

```bash
# 开发模式
$ pnpm run start

# 监听模式（自动重启）
$ pnpm run start:dev

# 生产模式
$ pnpm run start:prod
```

## 运行测试

```bash
# 单元测试
$ pnpm run test

# e2e 测试
$ pnpm run test:e2e

# 测试覆盖率
$ pnpm run test:cov
```

## 代码格式化

```bash
# 格式化代码
$ pnpm run format

# 运行 ESLint 检查并修复
$ pnpm run lint
```

## 部署

查看 [NestJS 部署文档](https://docs.nestjs.com/deployment) 了解更多信息。

## 资源

- [NestJS 文档](https://docs.nestjs.com)
- [NestJS Discord 社区](https://discord.gg/G7Qnnhy)
- [NestJS 官方课程](https://courses.nestjs.com/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## 在 Apifox 里关联本项目的 Swagger

- 先启动服务（保证能访问到接口）。
- Apifox：导入 → 选 OpenAPI / Swagger → URL。
- 填写：http://127.0.0.1:3000/openapi.json
  （端口以你实际 PORT 为准；局域网/部署环境把主机改成对应域名或 IP。）
- 导入后可再设环境变量里的 baseUrl，与 Nest 监听地址一致。
