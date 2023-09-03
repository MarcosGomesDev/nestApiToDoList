import { AppController } from '@application/controllers/app.controller';
import { AppService } from '@application/services/app.service';
import { Module } from '@nestjs/common';
import { DataModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users.module';
import { TasksModule } from './tasks.module';

@Module({
  imports: [DataModule, UsersModule, TasksModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
