import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { User } from './user.service';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取所有用户
   * @returns 用户列表
   */
  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  /**
   * 根据ID获取用户
   * @param id - 用户ID
   * @returns 用户对象或undefined
   */
  @Get(':id')
  findOne(@Param('id') id: string): User | undefined {
    return this.userService.findOne(+id);
  }

  /**
   * 创建新用户
   * @param user - 用户信息
   * @returns 创建的用户对象
   */
  @Post()
  create(@Body() CreateUserDto: CreateUserDto): User {
    return this.userService.create(CreateUserDto);
  }
}
