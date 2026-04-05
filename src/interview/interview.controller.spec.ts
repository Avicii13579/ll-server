import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { EventService } from 'src/common/services/event.service';
import { InterviewController } from './interview.controller';

describe('InterviewController', () => {
  let controller: InterviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterviewController],
      providers: [
        {
          provide: EventService,
          useValue: {
            generateTimeMessages: () => of('test'),
          },
        },
      ],
    }).compile();

    controller = module.get<InterviewController>(InterviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
