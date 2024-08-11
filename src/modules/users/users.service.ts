import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'prisma/service/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private saltOrRounds = 10;
  constructor(private readonly prismaService: PrismaService) {}

  async create(newUser: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (user) {
      throw new ConflictException('Este email já possui um usuário cadastrado');
    }

    newUser.password = await bcrypt.hash(newUser.password, this.saltOrRounds);

    await this.prismaService.user.create({
      data: newUser,
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
