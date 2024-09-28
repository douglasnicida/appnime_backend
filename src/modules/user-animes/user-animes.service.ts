import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserAnimeDto } from './dto/update-user-anime.dto';
import { PrismaService } from 'prisma/service/prisma.service';
import { AnimesService } from '../animes/animes.service';
import { CreateUserAnimeDto } from './dto/create-user-anime.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { User } from '@prisma/client';

@Injectable()
export class UserAnimesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AnimesService))
    private readonly animeService: AnimesService,
  ) {}

  @UseGuards(AuthGuard)
  async create(
    @AuthUser() user: User,
    createUserAnimeInfo: CreateUserAnimeDto,
  ) {
    const anime = await this.animeService.findByID(createUserAnimeInfo.animeID);

    if (!anime) {
      throw new NotFoundException('Anime not found!');
    }

    const newAnimeUser = await this.prismaService.animeUser.create({
      data: {
        userID: user.id,
        animeID: anime.id,
        user_anime_rating: -1,
      },
    });

    return newAnimeUser;
  }

  @UseGuards(AuthGuard)
  async findOne(@AuthUser() user: User, animeID: number) {
    const userAnime = await this.prismaService.animeUser.findMany({
      where: {
        userID: user.id,
        animeID: animeID,
      }
    });

    if (!userAnime) {
      throw new NotFoundException('User-anime not found!');
    }

    return userAnime[0];
  }

  async findByUser(@AuthUser() user: User) {
    const animes = await this.prismaService.animeUser.findMany({
      where: {
        userID: user.id,
      }
    });

    if (!animes) {
      throw new NotFoundException('This user doesnt have animes added.');
    }

    return animes;
  }

  @UseGuards(AuthGuard)
  async updateRating(@AuthUser() user: User, updateInfo: UpdateUserAnimeDto) {
    try {
      await this.prismaService.animeUser.updateMany({
        where: {
          userID: user.id,
          animeID: updateInfo.animeID,
        },
        data: {
          userID: user.id,
          animeID: updateInfo.animeID,
          user_anime_rating: updateInfo.user_anime_rating,
        },
      });

      return  { message: 'Anime rating updated successfully' };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} userAnime`;
  }
}
