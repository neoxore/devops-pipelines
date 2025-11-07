import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/info')
  @HttpCode(HttpStatus.OK)
  async getHello(): Promise<string> {
    return this.appService.getInfo();
  }

  @Get('/health')
  async getHealth() {
    console.log('Health check hit');
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
