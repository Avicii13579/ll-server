import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import {
  ConsumptionRecord,
  ConsumptionRecordDocument,
} from 'src/interview/schemas/consumption-record.schema';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ConsumptionRecord.name)
    private consumptionRecordModel: Model<ConsumptionRecordDocument>,
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
   * 获取用户信息
   */
  async getUserInfo(userId: string) {
    const user = await this.userModel.findById(userId).lean(); // lean() 返回普通 js 对象
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    // 不返回密码
    delete user.password;

    return user;
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

  /**
   * 获取用户消费记录
   */
  async getUserConsumptionRecords(
    userId: string,
    options?: { skip: number; limit: number },
  ) {
    const skip = options?.skip || 0;
    const limit = options?.limit || 20;

    const records = await this.consumptionRecordModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const stats = await this.consumptionRecordModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          successCount: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] },
          },
          failedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
          totalCost: { $sum: '$estimatedCost' },
        },
      },
    ]);

    return { records, stats };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    // 如果更新邮箱，检查邮箱是否已被使用
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: userId }, // 排除当前用户
      });

      if (existingUser) {
        throw new BadRequestException('邮箱已被使用');
      }
    }

    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    delete user.password;
    return user;
  }
}
