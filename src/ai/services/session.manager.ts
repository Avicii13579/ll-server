import { Injectable, Logger } from '@nestjs/common';
import { Message, SessionData } from '../interfaces/message.interface';
import { v4 as generateUUID } from 'uuid';
@Injectable()
export class SessionManager {
  private readonly logger = new Logger(SessionManager.name); // 为log 打上SessionManager的标签
  // 存储会话 -> 历史对话
  private sessions = new Map<string, SessionData>();

  createSession(
    userId: string,
    position: string,
    systemMessage: string,
  ): string {
    const sessionId = generateUUID();

    const sessionData: SessionData = {
      sessionId,
      userId,
      position,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
      ],
      createdAt: new Date(),
      lastActivityAt: new Date(),
    };

    this.sessions.set(sessionId, sessionData);
    this.logger.log(
      `创建会话：${sessionId}，用户：${userId}，职位：${position}`,
    );

    return sessionId;
  }

  /**
   * 向会话添加信息
   * @param sessionId 会话id
   * @param role 消息角色
   * @param content 消息内容
   */
  addMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
  ): void {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`会话不存在：${sessionId}`);
    }

    session.messages.push({
      role,
      content,
    });

    session.lastActivityAt = new Date();
    this.logger.debug(`添加消息到会话 ${sessionId}: ${role}`);
  }

  /**
   * 获取完整历史
   */
  getHistory(sessionId: string): Message[] {
    const session = this.sessions.get(sessionId);
    return session?.messages || [];
  }

  /**
   * 获取最近 N 条消息（优化 token）
   * 对话越长调用AI的成本越高，可以只保留最近几条和**第一条（必须保留）**
   */
  getRecentMessage(sessionId: string, count: number = 10): Message[] {
    const history = this.getHistory(sessionId);

    if (history.length === 0) {
      return [];
    }

    // 保留第一条
    const systemMessage = history[0];

    // 获取最近的 count 消息
    const recentMessage = history.slice(-count);

    // 如果最近消息不包含systemMessage 手动添加
    if (recentMessage[0].role !== 'system') {
      return [systemMessage, ...recentMessage];
    }

    return recentMessage;
  }

  // 结束会话
  endSession(sessionId: string): void {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      this.logger.log(`会话结束：${sessionId}`);
    }
  }

  /**
   * 清理过期会话（1h 未活动）
   * 生成环境中需要定期执行这个方法来清理缓存
   * 可以调用 @Corn 装饰器在后台定期执行
   */
  cleanExpiredSession(): void {
    const now = new Date();
    const expirationTime = 60 * 60 * 1000;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now.getTime() - session.lastActivityAt.getTime() > expirationTime) {
        this.logger.warn(`清理会话：${sessionId}`);
        this.sessions.delete(sessionId);
      }
    }
  }
}
