import type { Request } from 'express';
import type { JwtAuthUser } from '../jwt.strategy';

export interface AuthenticatedRequest extends Request {
  user: JwtAuthUser;
}
