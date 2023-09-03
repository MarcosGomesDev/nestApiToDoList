import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Bem vindo a api To-Do-list',
    };
  }
}
