import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getInfo(): Promise<string> {
    return 'Hey im Danila Kovalev\nthat`s my project for github https://github.com/neoxore';
  }
}
