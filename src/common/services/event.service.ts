import { interval, Observable, Subject, map, tap } from 'rxjs';

export class EventService {
  // 事件总线，实现订阅修改
  private eventSubject = new Subject<string>();

  // 发送一个事件
  emit(message: string) {
    this.eventSubject.next(message);
  }

  // 获取事件流的 Observable 支持持续推送
  getEvents(): Observable<string> {
    return this.eventSubject.asObservable();
  }

  // 生成定时推送的 Observable
  generateTimeMessages(): Observable<string> {
    return interval(1000).pipe(
      map((count: number) => `设置第一个 ${count + 1} 条信息`),
      tap((message) => {
        console.log('推送消息：', message);
      }),
    );
  }
}
