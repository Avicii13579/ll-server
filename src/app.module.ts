import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TraceIdMiddleware } from './common/middleware/log.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
// import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ConfigValidationSchema } from './config/config.schema';
import { DatabaseModule } from './database/database.module';
import { InterviewModule } from './interview/interview.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: ConfigValidationSchema, // 用 ConfigValidationSchema 校验环境变量
      validationOptions: {
        allowUnknown: true, // 允许出现ConfigValidationSchema为定义的变量
        abortEarly: true, // 遇到第一错误就停下
      },
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        winston.format.json(),
      ),
      defaultMeta: {
        service: 'll-server',
      },
      transports: [new winston.transports.Console()],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/my_nest_app'),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET') || 'secret-key',
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES_IN') || '7d',
          },
        };
      },
      inject: [ConfigService],
      global: true, // 全局模块任何地方可使用
    }),
    DatabaseModule,
    InterviewModule,
  ],
  controllers: [AppController],
  providers: [
    JwtStrategy, // 全局校验可用
    AppService,
    // LoggerMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // {
    //   provide: APP_GUARD, // 注意这个已被 jwt 代替
    //   useClass: AuthGuard,
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
// Nest 应用在启动时调用
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 将中间件应用到所有路由上
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
