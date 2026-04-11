import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

// 认证守卫：已被 jwt 代替

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path ?? request.url?.split('?')[0] ?? '';
    // 与 main.ts 中 Swagger jsonDocumentUrl（默认 openapi.json → 根路径 /openapi.json）一致
    if (path.startsWith('/api-docs') || path === '/openapi.json') {
      return true;
    }
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('为提供认证令牌');
    }

    if (!this.validateToken(token)) {
      throw new UnauthorizedException('认证令牌实效');
    }

    request.user = this.getUserFromToken(token) as object;
    // 验证 token
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validateToken(token: string): boolean {
    return token.length > 10;
  }

  private getUserFromToken(token: string): any {
    // 提取用户信息返回

    return { id: 1, name: '测试用户', token };
  }
}
