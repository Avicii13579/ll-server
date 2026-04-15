import { Body, Controller, Post, Req, Sse, UseGuards } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { EventService } from 'src/common/services/event.service';
import { InterviewService } from './services/interview.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

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
  @UseGuards(JwtAuthGuard)
  async analyzeResume(
    @Body() body: { position: string; resume: string; jobDescription: string },
    @Req() req: AuthenticatedRequest,
  ) {
    const result = await this.interviewService.analyzeResume(
      req.user.userId,
      body.position,
      body.resume,
      body.jobDescription,
    );

    return {
      code: 200,
      data: result,
    };
  }

  @Post('/continue-conversation')
  async continueConversation(
    @Body() body: { sessionId: string; question: string },
  ) {
    const result = await this.interviewService.continueConversation(
      body.sessionId,
      body.question,
    );

    return {
      code: 200,
      data: {
        response: result,
      },
    };
  }
}
