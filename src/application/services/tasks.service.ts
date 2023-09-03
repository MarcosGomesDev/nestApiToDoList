import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infra/database/client/prisma.service';
import { CreateTaskDto } from '@application/dtos/create-task.dto';
import { UpdateTaskDto } from '@application/dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    await this.prisma.task.create({
      data: {
        task: createTaskDto.task,
        isChecked: false,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tarefa criada com sucesso',
    };
  }

  async findAll(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return tasks.map(({ userId, ...task }) => task);
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    delete task.userId;

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.prisma.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Tarefa atualizada com sucesso.',
    };
  }

  async remove(id: string) {
    await this.prisma.task.delete({
      where: {
        id,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Tarefa deletada com sucesso.',
    };
  }
}
