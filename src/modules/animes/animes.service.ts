import {
  Injectable,
  Inject,
  forwardRef,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/service/prisma.service';
import { UsersService } from 'src/modules/users/users.service';
import { PaginatedResult, Pagination } from 'src/decorators/pagination.decorator';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { Anime } from '@prisma/client';

@Injectable()
export class AnimesService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async create(newAnime: CreateAnimeDto) {
    const anime = await this.prismaService.anime.findFirst({
      where: {
        jp_title: newAnime.jp_title,
        en_title: newAnime.en_title,
      },
    });

    if (anime) {
      throw new ConflictException('This anime already exists.');
    }

    await this.prismaService.anime.create({
      data: {
        jp_title: newAnime.jp_title,
        en_title: newAnime.en_title,
        description: newAnime.description,
        start_airing: newAnime.start_airing,
        finished_airing: newAnime.finished_airing,
        recently_added: newAnime.recently_added,
        ep_count: newAnime.ep_count,
        image: newAnime.image,
        type: newAnime.type,
        avg_rating: newAnime.avg_rating,
        studio_name: newAnime.studio_name,
      },
    });
  }

  /*
  * Get all anime witb pagination
  * @param pagination: Pagination -> page, limit, offset
  * @param filters: string -> search filters
  */
  async findAll(pagination: Pagination, filters?: string[]): Promise<PaginatedResult<Anime>> {
    let { page, limit, offset } = pagination;

    // Getting the total count of animes
    const responseTotal: Anime[] = await this.prismaService.anime.findMany({
      orderBy: {
        start_airing: 'desc',
      }
    });

    const response: Anime[] = await this.prismaService.anime.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        start_airing: 'desc',
      },
      // where: {
      //   en_title: {contains: filters[0] || ''},
      //   jp_title: {contains: filters[0] || ''}, 
      //   avg_rating: filters[1] || null
      // }
    });

    let result : PaginatedResult<Anime> = new PaginatedResult<Anime>();

    result.data = response;
    result.meta = {
      total:  responseTotal.length,
      lastPage: Math.ceil(responseTotal.length / limit),
      next: limit + offset,
      prev: (offset >= limit) ? offset - limit : 0,
      currentPage: page,
      perPage: limit,
    }

    return result;
  }

  async find(name: string) {
    const anime = await this.prismaService.anime.findMany({
      where: {
        en_title: {
          contains: name,
        },
      },
    });

    if (!anime) {
      throw new NotFoundException('Anime not found.');
    }

    return anime;
  }

  async findByID(id: number) {
    const anime = await this.prismaService.anime.findUnique({
      where: {
        id: id,
      },
    });

    if (!anime) {
      throw new NotFoundException('Anime not found.');
    }

    return anime;
  }

  remove(id: number) {
    return `This action removes a #${id} anime`;
  }
}
