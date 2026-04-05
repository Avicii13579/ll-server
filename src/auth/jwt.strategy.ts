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

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret-key',
    });
  }

  validate(payload: JwtPayload): JwtAuthUser {
    if (!payload.userId) {
      throw new UnauthorizedException('Token 无效');
    }
    return {
      userId: payload.userId,
      username: payload.username,
      roles: payload.roles ?? ['user'],
    };
  }
}
