import { CreateTaskDto } from '@application/dtos/create-task.dto';
import { UpdateTaskDto } from '@application/dtos/update-task.dto';
import { TasksService } from '@application/services/tasks.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return this.tasksService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch()
  update(@Query('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.tasksService.remove(id);
  }
}
