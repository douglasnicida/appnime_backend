import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { MyResponse } from 'src/interfaces/interfaces';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<MyResponse<void>> {
    await this.usersService.create(createUserDto);
    return {
      status: HttpStatus.OK,
      message: 'User created with success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MyResponse<User>> {
    const response = await this.usersService.findOne(+id);

    return {
      status: HttpStatus.OK,
      message: 'User returned with success.',
      payload: response,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
