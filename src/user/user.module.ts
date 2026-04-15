import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user.schema';
import {
  ConsumptionRecord,
  ConsumptionRecordSchema,
} from 'src/interview/schemas/consumption-record.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ConsumptionRecord.name, schema: ConsumptionRecordSchema },
    ]), // 注册 UserSchema 数据库
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
})
export class UserModule {}
