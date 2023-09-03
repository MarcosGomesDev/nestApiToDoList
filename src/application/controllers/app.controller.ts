import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
