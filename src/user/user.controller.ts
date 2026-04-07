import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CatchInterceptor } from 'src/common/interceptors/catch.interceptor';
// import { AuthGuard } from 'src/auth/auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { JwtAuthUser } from 'src/auth/jwt.strategy';
import { RoleGuard, Roles } from 'src/role/role.guard';
import { HttpExceptionFilter } from 'src/common/filters/http-exceptions.filter';
import { ValidationExceptionFilter } from 'src/common/filters/validation-exceptions.filter';
import { UpdateUserDto } from './dto/update-user.dto';

interface AuthenticatedRequest extends Request {
  user: JwtAuthUser;
}

@Controller('users')
@UseFilters(HttpExceptionFilter)
// @UseGuards(AuthGuard) // 使用守卫
// 控制器级别的拦截 支持多个
// @UseInterceptors(LoggingInterceptor, CatchInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  @UseGuards(JwtAuthGuard)
  getInfo(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  /**
   * 获取管理员信息
   */
  @Get('admin')
  @UseGuards(RoleGuard)
  @Roles('admin')
  getAdminInfo(@Req() req: AuthenticatedRequest) {
    return { message: '管理员信息', user: req.user };
  }

  /**
   * 获取所有用户
   * @returns 用户列表
   */
  @Get()
  // 方法级别拦截
  @UseInterceptors(CatchInterceptor)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * 根据ID获取用户
   * @param id - 用户ID
   * @returns 用户对象或undefined
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    if (id > 1000) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    return this.userService.findOne(id.toString());
  }

  /**
   * 创建新用户
   * @param user - 用户信息
   * @returns 创建的用户对象
   */
  @Post()
  // 局部通过 pipe 配置 DTO 校验
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  @UseFilters(ValidationExceptionFilter)
  async create(@Body() CreateUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(CreateUserDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.update(id.toString(), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.delete(id.toString());
  }
}
