import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserAnimesService } from './user-animes.service';
import { CreateUserAnimeDto } from './dto/create-user-anime.dto';
import { UpdateUserAnimeDto } from './dto/update-user-anime.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { AnimeUser, User } from '@prisma/client';
import { AuthenticatedUser, MyResponse } from 'src/interfaces/interfaces';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('user-animes')
export class UserAnimesController {
  constructor(private readonly userAnimesService: UserAnimesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @AuthUser() user: AuthenticatedUser,
    @Body() createUserAnimeDto: CreateUserAnimeDto,
  ): Promise<MyResponse<void>> {
    await this.userAnimesService.create(user, createUserAnimeDto);

    return {
      status: HttpStatus.CREATED,
      message: 'Anime added for authenticated user with success',
    };
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  async findByUser(@AuthUser() user: AuthenticatedUser): Promise<MyResponse<AnimeUser[]>> {
    const response = await this.userAnimesService.findByUser(user);

    return {
      status: HttpStatus.OK,
      message: 'User anime returned with success.',
      payload: response,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @AuthUser() user: AuthenticatedUser,
    @Param('id') animeID: string,
  ): Promise<MyResponse<AnimeUser>> {
    const response = await this.userAnimesService.findOne(user, +animeID);

    return {
      status: HttpStatus.OK,
      message: 'User anime returned with success.',
      payload: response,
    };
  }
  

  @Patch()
  @UseGuards(AuthGuard)
  async update(
    @AuthUser() user: AuthenticatedUser,
    @Body() updateRating: UpdateUserAnimeDto,
  ): Promise<MyResponse<void>> {
    await this.userAnimesService.updateRating(user, updateRating);

    return {
      status: HttpStatus.OK,
      message: 'Anime rating updated with success!',
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @AuthUser() user: AuthenticatedUser) {
    return this.userAnimesService.remove(+id, user);
  }
}
