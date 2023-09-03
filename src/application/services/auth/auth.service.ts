import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users.service';
import { UserToken } from 'src/auth/models/UserToken';
import { UserPayload } from 'src/auth/models/UserPayload';
import { UnauthorizedError } from 'src/auth/errors/unauthorized.error';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from '@application/dtos/create-user.dto';
import { PrismaService } from '@infra/database/client/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    delete user.password;

    return {
      ...user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new HttpException(
        'Este e-mail já está sendo utilizado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    createUserDto.password = passwordHash;

    const createdUser = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        isActive: true,
      },
    });

    delete createdUser.created_at;
    delete createdUser.updated_at;

    const loggedUser = await this.login(createdUser);

    return {
      statusCode: HttpStatus.CREATED,
      loggedUser,
    };
  }
}
