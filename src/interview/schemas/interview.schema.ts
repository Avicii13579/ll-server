import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema()
export class Interview extends Document {
  @Prop({
    required: true,
  })
  position: string;

  // 嵌入关联：用户快照
  @Prop({
    type: {
      _id: Types.ObjectId,
      username: String,
      email: String,
    },
  })
  userSnapshot: any;

  // 引用关联：
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user_id: string;

  @Prop()
  score: number;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
