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
import { AuthenticatedUser, OrderByTypes } from 'src/interfaces/interfaces';
import { PaginatedResult, Pagination } from 'src/decorators/pagination.decorator';

@Injectable()
export class UserAnimesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => AnimesService))
    private readonly animeService: AnimesService,
  ) {}

  async create(
    user: AuthenticatedUser,
    createUserAnimeInfo: CreateUserAnimeDto,
  ) {

    let  anime = await this.animeService.findByID(createUserAnimeInfo.animeID);

    if (!anime) {
      throw new NotFoundException('Anime not found!');
    }

    const newAnimeUser = await this.prismaService.animeUser.create({
      data: {
        userID: user.id,
        animeID: anime.id,
        user_anime_rating: createUserAnimeInfo.user_anime_rating,
      },
    });

    return newAnimeUser;
  }

  async findOne(user: AuthenticatedUser, animeID: number) {
    const userAnime = await this.prismaService.animeUser.findFirst({
      where: {
        userID: user.id,
        animeID: animeID,
      },
    });

    if (!userAnime) {
      throw new NotFoundException('User-anime not found!');
    }

    return userAnime[0];
  }

  async findByUser(
    user: AuthenticatedUser,
    orderByRating?: OrderByTypes,
    orderByAnimeName?: OrderByTypes,
    searchTitle?: string
  ) {
    const orderBy = [];
  
    if (orderByRating) {
      orderBy.push({ user_anime_rating: OrderByTypes[orderByRating] });
    }
  
    if (orderByAnimeName) {
      orderBy.push({ anime: { en_title: OrderByTypes[orderByAnimeName] } });
    }
  
    const titleCondition = searchTitle
      ? {
          OR: [
            { anime: { en_title: { contains: searchTitle } } },
            { anime: { jp_title: { contains: searchTitle } } },
          ],
        }
      : {};
  
    const animes = await this.prismaService.animeUser.findMany({
      where: {
        userID: user.id,
        AND: [
          titleCondition,
        ],
      },
      include: { anime: true },
      orderBy: orderBy.length ? orderBy : undefined,
    });
  
    if (animes.length === 0) {
      throw new NotFoundException("This user doesn't have animes added.");
    }
  
    return animes;
  }

  async updateRating(user: AuthenticatedUser, updateInfo: UpdateUserAnimeDto) {
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

  async remove(id: number, user: AuthenticatedUser) {
    return await this.prismaService.animeUser.delete({
      where: {
        userID_animeID: {
          userID: user.id,
          animeID: id,
        }
      }
    });
  }
}
