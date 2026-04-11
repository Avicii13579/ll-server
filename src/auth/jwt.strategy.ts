import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/** 签发 access token 时写入的 payload 字段（需与签名处一致） */
export interface JwtPayload {
  userId: string;
  username?: string;
  roles?: string[];
}

/** 挂载到 `request.user` 上的对象 */
export interface JwtAuthUser {
  userId: string;
  username?: string;
  roles: string[];
}

// 允许 JwtStrategy 被 NestJS 依赖注入管理
@Injectable()
// JwtStrategy 继承 PassportStrategy，有了 jwt 的验证能力
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // 给父类构造函数，传参数
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 获取 token
      ignoreExpiration: false, // 不忽略 jwt 的过期时间
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret-key', // 获取密钥
    });
  }

  // 校验 jwt
  validate(payload: JwtPayload): JwtAuthUser {
    if (!payload.userId) {
      throw new UnauthorizedException('Token 无效');
    }
    return {
      // 注意这个返回对象会被附加到 request.user
      userId: payload.userId,
      username: payload.username,
      roles: payload.roles ?? ['user'],
    };
  }
}
