import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Interview } from './schemas/interview.schema';
import { Model } from 'mongoose';

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(Interview.name) private interviewModel: Model<Interview>,
  ) {}

  // 获取面试信息，关联用户信息
  async getInterviewsWithUsers() {
    return this.interviewModel.find().populate('user_id').exec();
  }
}
