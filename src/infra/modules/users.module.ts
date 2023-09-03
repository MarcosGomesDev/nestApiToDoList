import { UsersController } from '@application/controllers/users.controller';
import { UsersService } from '@application/services/users.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
