import { SetMetadata } from '@nestjs/common';
// SetMetadata 创建自定义装饰器
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
