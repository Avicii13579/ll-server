import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class UserService {
  constructor(
    // User.name 注入 Model； Model<UserDocument> Mongoose 类型
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * 查询所有用户
   * @returns 用户列表
   */
  // @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  // @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
   * 根据ID查询单个用户
   * @param id - 用户ID
   * @returns 用户对象
   */
  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * 创建新用户
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  /**
   * 更新用户（部分字段）
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true }) // new：支持返回新数据
      .exec();
  }

  /**
   * 删除用户
   */
  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  // 校验密码
  async validatePassword(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }
    return user;
  }

  /** 注册 */
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    // 检查用户名是否存在
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new BadRequestException('用户名或邮箱已存在');
    }

    // 创建新用户，密码会在 pre('save') 中自动加密
    const newUser = new this.userModel({
      username,
      email,
      password,
    });

    await newUser.save();

    // 返回用户信息，不返回密码
    const result = newUser.toObject(); // 将 Mongoose 文档转化为 js 对象
    delete result.password;

    return result;
  }

  /** 登陆 */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 找用户
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('邮箱或密码不正确');
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码不正确');
    }

    // 生成token，支持前端免密获取数据
    const token = this.jwtService.sign({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    // 返回 token 和 用户信息
    const userInfo = user.toObject();
    delete userInfo.password;

    return {
      token,
      user: userInfo,
    };
  }
}
