import { Module } from '@nestjs/common';
import { AnimesService } from './animes.service';
import { AnimesController } from './animes.controller';
import { PrismaService } from 'prisma/service/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AnimesController],
  providers: [AnimesService, PrismaService, UsersService],
})
export class AnimesModule {}
