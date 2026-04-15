import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { ResponseUtil } from 'src/common/utils/response.util';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/auth/public.decorator';

interface AuthenticatedRequest extends Request {
  user: JwtAuthUser;
}

@ApiTags('用户')
@Controller('users')
@UseFilters(HttpExceptionFilter)
// @UseGuards(AuthGuard) // 使用守卫
// 控制器级别的拦截 支持多个
// @UseInterceptors(LoggingInterceptor, CatchInterceptor)
// jwt Nest 文档里 Passport 集成写明：validate() 的返回值会被当作“已认证用户”，并挂到请求上（文档里写的是 req.user）。
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  // 获取前必须提供有效
  async getInfo(@Req() req: AuthenticatedRequest) {
    const { userId } = req.user;
    const userInfo = await this.userService.getUserInfo(userId);
    return ResponseUtil.success(userInfo, '获取成功');
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
  // @Get(':id')
  // async findOne(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
  //   if (id > 1000) {
  //     throw new NotFoundException(`用户 ID ${id} 不存在`);
  //   }
  //   return this.userService.findOne(id.toString());
  // }

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

  /**
   * 注册
   */
  @Public() // 不用jwt 校验
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.userService.register(registerDto);
    return ResponseUtil.success(result, '注册成功');
  }

  /** 登陆 */
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.userService.login(loginDto);
    return ResponseUtil.success(result, '登录成功');
  }

  /**
   * 获取用户消费记录（包括简历押题、专项面试、综合面试）
   */
  @Get('consumption-records')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '获取用户消费记录',
    description:
      '获取用户所有的功能消费记录，包括简历押题、专项面试、综合面试等',
  })
  async getUserConsumptionRecords(
    @Req() req: AuthenticatedRequest,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 20,
  ) {
    const { userId } = req.user;
    const result = await this.userService.getUserConsumptionRecords(userId, {
      skip,
      limit,
    });
    return ResponseUtil.success(result, '获取成功');
  }

  @Put('profile')
  async updateUserProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = req.user;
    const user = await this.userService.updateUser(userId, updateUserDto);
    return ResponseUtil.success(user, '更新成功');
  }
}
