import { Module } from '@nestjs/common';
import { UserAnimesService } from './user-animes.service';
import { UserAnimesController } from './user-animes.controller';
import { AnimesService } from '../animes/animes.service';
import { PrismaService } from 'prisma/service/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [UserAnimesController],
  providers: [UserAnimesService, AnimesService, UsersService, PrismaService],
})
export class UserAnimesModule {}
