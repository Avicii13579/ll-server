import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigService } from '@nestjs/config';
// import { ConfigModule } from '@nestjs/config';

@Module({
  // imports: [ConfigModule],
  providers: [
    DatabaseService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (ConfigService: ConfigService) => {
        // 注意：useFactory 使用了 ConfigService 需要 inject 的注入
        const dbType = ConfigService.get<string>('DB_TYPE', 'mongodb');

        if (dbType === 'mongodb') {
          return {
            type: 'mongodb',
            uri: ConfigService.get<string>('MONGODB_URI'),
          };
        } else if (dbType === 'postgres') {
          return {
            type: 'postgres',
            host: ConfigService.get<string>('POSTGRES_HOST'),
            port: ConfigService.get<string>('POSTGRES_PORT'),
            database: ConfigService.get<string>('POSTGRES_DB'),
          };
        }
        throw new Error(`不支持的数据库类型： ${dbType}`);
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    'DATABASE_CONNECTION',
    DatabaseService, // 导出给其他模块使用
  ],
})
export class DatabaseModule {}
