import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// _id: false 组织嵌套文档生成单独的id
@Schema({ _id: false })
export class Profile {
  @Prop()
  bio: string;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;
}
const ProfileSchema = SchemaFactory.createForClass(Profile);

@Schema({
  timestamps: true, // 默认添加创建时间
  toJSON: { virtuals: true }, // 展示虚拟字段
})
// 继承 Document 可以获取 Mongodb 的操作方法
export class User extends Document {
  @Prop({
    require: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 12,
    validate: {
      // 自定义校验 不能包含敏感词汇
      validator: function (v: string) {
        const bannedWords = ['admin', 'root', 'system'];
        return !bannedWords.includes(v.toLowerCase());
      },
    },
  })
  username: string;

  @Prop({
    require: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email: string;

  @Prop({
    require: true,
    trim: true,
    minLength: 6,
  })
  password: string;

  @Prop({
    type: Number,
    min: 0,
    max: 150,
  })
  age: number;

  // @Prop({ default: Date.now })
  // createdAt: Date;

  @Prop({
    type: ProfileSchema,
  })
  profile: Profile;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
  })
  status: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isAdmin: boolean;

  @Prop({
    type: Number,
    default: 0,
  })
  loginCount: number;

  @Prop()
  lastLoginAt: Date;

  // 虚拟字段：账户是否处于活跃状态
  readonly isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 添加虚拟字段
UserSchema.virtual('isActive').get(function () {
  return this.status === 'active';
});

// 创建索引
UserSchema.index({ username: 1, email: 1 });
UserSchema.index({ status: 1 });
