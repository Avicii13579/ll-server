import { Body, Controller, Post, Sse } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { EventService } from 'src/common/services/event.service';
import { InterviewService } from './services/interview.service';

// 实现 SSE 连接

@Controller('interview')
export class InterviewController {
  constructor(
    private readonly eventService: EventService,
    private readonly interviewService: InterviewService,
  ) {}

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

  @Post('analyze-resume')
  async analyzeResume(
    @Body() body: { resume: string; jobDescription: string },
  ) {
    const result = await this.interviewService.analyzeResume(
      body.resume,
      body.jobDescription,
    );

    return {
      code: 200,
      data: result,
    };
  }
}
