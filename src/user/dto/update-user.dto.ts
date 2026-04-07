import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/** 更新用户：字段均可选，校验规则继承 CreateUserDto */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
