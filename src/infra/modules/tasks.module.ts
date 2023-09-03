import { TasksController } from '@application/controllers/tasks.controller';
import { TasksService } from '@application/services/tasks.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
