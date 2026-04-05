import { Controller, Sse } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { EventService } from 'src/common/services/event.service';

// 实现 SSE 连接

@Controller('interview')
export class InterviewController {
  constructor(private readonly eventService: EventService) {}

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    return this.eventService.generateTimeMessages().pipe(
      map(
        (message) =>
          ({
            data: JSON.stringify({
              timestamp: new Date().toISOString(),
              message,
            }),
          }) as MessageEvent,
      ),
    );
  }
}
