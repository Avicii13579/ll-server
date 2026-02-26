import { Injectable, NotFoundException } from '@nestjs/common';

/**
 * 用户接口
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' },
  ];

  /**
   * 查询所有用户
   * @returns 用户列表
   */
  findAll(): User[] {
    return this.users;
  }

  /**
   * 根据ID查询单个用户
   * @param id - 用户ID
   * @returns 用户对象
   */
  findOne(id: number): User {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(`用户 ID ${id} 不存在`);
    }
    return user;
  }

  /**
   * 创建新用户
   * @param user - 用户信息（不包含id）
   * @returns 创建的用户对象
   */
  create(user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }
}
