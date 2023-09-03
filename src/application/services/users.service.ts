import { CreateUserDto } from '@application/dtos/create-user.dto';
import { UpdateUserDto } from '@application/dtos/update-user.dto';
import { PrismaService } from '@infra/database/client/prisma.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExists) {
      throw new HttpException(
        'Este e-mail já está sendo utilizado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    createUserDto.password = passwordHash;

    await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        isActive: true,
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuário criado com sucesso',
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    delete user.password;

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    delete user.created_at;
    delete user.updated_at;

    if (user.isActive === false) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Dados alterados com sucesso!',
    };
  }

  async updateCurrentUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Dados alterados com sucesso!',
    };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    await this.prisma.task.deleteMany({
      where: {
        userId: id,
      },
    });

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Usuário deletado com sucesso',
    };
  }
}
