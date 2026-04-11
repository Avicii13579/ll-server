import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
// 会触发 passport 的 jwt 策略
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 引入 NestJS 的反射器：用来读取自定义元数据的内置类； 刚才我们提到 @Public() 装饰器会在接口上打上一个 isPublic: true 的标记（即设置了元数据）。而在守卫（Guard）中，我们无法直接看到这个标记，必须借助 Reflector 来读取
  constructor(private reflector: Reflector) {
    super();
  }

  // 判断是否允许请求通过
  canActivate(context: ExecutionContext) {
    // getAllAndOverride 获取指定键的元数据（Metadata），并且在存在多个目标时支持“覆盖（Override）”机制
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // 获取当前处理方法的元数据
      context.getClass(), // 获取当前类的元数据
    ]);

    // 公开接口 不走 jwt 直接访问
    if (isPublic) {
      return true;
    }

    // 若非公开接口，调用父类 AuthGuard 的 canActivate 继续验证
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: unknown,
    user: unknown,
    info: Error | undefined,
  ): TUser {
    if (err || !user) {
      // 记录详细的错误信息用于调试
      const errorMessage = info?.message || '无效的 Token';
      const errorName = info?.name || 'UnknownError';

      // 根据不同的错误类型提供更友好的错误信息
      let friendlyMessage = String(errorMessage);
      if (
        errorName === 'JsonWebTokenError' ||
        errorName === 'TokenExpiredError'
      ) {
        const msg = String(errorMessage);
        if (msg.includes('invalid signature')) {
          friendlyMessage =
            'Token 签名无效，可能是 JWT_SECRET 配置不一致或 Token 被篡改';
        } else if (msg.includes('jwt malformed')) {
          friendlyMessage = 'Token 格式错误，请检查 Authorization 头部格式';
        } else if (
          msg.includes('jwt expired') ||
          errorName === 'TokenExpiredError'
        ) {
          friendlyMessage = 'Token 已过期，请重新登录';
        }
      }

      throw new UnauthorizedException(friendlyMessage);
    }
    return user as TUser;
  }
}
