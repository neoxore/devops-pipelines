import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return info message', async () => {
    const result = await appController.getHello();
    expect(result).toContain('Danila');
  });

  it('should return ok health', async () => {
    const result = await appController.getHealth();
    expect(result.status).toContain('ok')
  })
});
