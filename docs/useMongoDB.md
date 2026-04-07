# 本地 MongoDB 与 NestJS（Mongoose）

本仓库使用数据库名 **`my_nest_app`**，连接串与 `.env.development` / `.env.production` 中的 `MONGODB_URI` 一致；应用里通过 `@nestjs/mongoose` 在 `app.module.ts` 中建立连接。

---

## 安装（macOS + Homebrew）

若尚未安装：

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

数据目录因芯片架构不同：

| 架构   | 常见数据目录 |
|--------|----------------|
| Apple Silicon | `/opt/homebrew/var/mongodb` |
| Intel         | `/usr/local/var/mongodb`     |

---

## 启动 MongoDB

任选其一：

```bash
# 前台运行（需先确保 dbpath 目录存在且有权限）
mongod --dbpath /opt/homebrew/var/mongodb
```

```bash
# 后台作为系统服务（推荐开发时使用）
brew services start mongodb-community@7.0
```

停止服务：

```bash
brew services stop mongodb-community@7.0
```

---

## 用 shell 验证

新版 MongoDB 使用 **`mongosh`**（若只有旧版客户端，命令可能是 `mongo`）：

```bash
mongosh
```

连接本机默认实例：

```bash
mongosh "mongodb://localhost:27017"
```

---

## 数据库与集合（MongoDB 无“表”概念）

在 `mongosh` 中：

```javascript
// 切换到业务库（不存在时会按需创建，写入数据后才会在 show dbs 里稳定出现）
use my_nest_app

// 创建集合并插入文档（集合会在首次写入时自动创建）
db.users.insertOne({ name: "jiuan", status: "learning NestJS" })

// 查看当前库中的集合
show collections

// 查看已有数据库（新库在真正有数据落盘后才更容易被看到）
show dbs
```

说明：**`show dbs` 只列出已有数据的数据库**；仅 `use my_nest_app` 未写入时，有时列表里仍看不到该库，属正常现象。

---

## 与本项目对接

1. **环境变量**（已存在于仓库示例 env 中）

   - `MONGODB_URI=mongodb://localhost:27017/my_nest_app`
   - `DB_TYPE=mongodb`（供 `DatabaseModule` 等读取连接信息）

2. **Nest 连接**

   - 应用在 `app.module.ts` 中使用 `MongooseModule.forRoot(...)` 连接上述地址；本地开发前请先保证 MongoDB 已启动且端口 **27017** 可访问。

3. **依赖**（若从零初始化项目可执行）

   ```bash
   pnpm add @nestjs/mongoose mongoose
   pnpm add -D @types/mongoose
   ```

   当前 `package.json` 已包含这些依赖时无需重复安装。

---

## 常见问题

| 现象 | 处理 |
|------|------|
| 连接被拒绝 `ECONNREFUSED` | 确认 `mongod` 已启动：`brew services list` 或 `lsof -i :27017` |
| `dbpath` 权限错误 | `mkdir -p <dbpath>` 并检查目录所有者，或对数据目录使用 `chown` |
| 端口被占用 | 修改 MongoDB 配置中的端口，并同步修改 `MONGODB_URI` 与 `MongooseModule.forRoot` |

---

## 延伸阅读

- 官方安装文档：<https://www.mongodb.com/docs/manual/installation/>
- Mongoose 文档：<https://mongoosejs.com/>
- NestJS Mongoose：<https://docs.nestjs.com/techniques/mongodb>
