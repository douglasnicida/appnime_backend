import {
  Injectable,
  Inject,
  forwardRef,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/service/prisma.service';
import { PaginatedResult, Pagination } from 'src/decorators/pagination.decorator';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { Anime } from '@prisma/client';

@Injectable()
export class AnimesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(newAnime: CreateAnimeDto) {
    const anime = await this.prismaService.anime.findFirst({
      where: {
        jp_title: newAnime.jp_title,
        en_title: newAnime.en_title
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
  * @param pagination: Pagination -> page, limit, offset, sort?, search?
  */
  async findAll(pagination: Pagination): Promise<PaginatedResult<Anime>> {
    let { page, limit, offset, search, sort } = pagination;
    
    const whereQuery = search ? {
      jp_title: { contains: search },
      OR: [
        { en_title: { contains: search } },
      ]
    } : {}

    // Getting the total count of animes
    const responseTotal: Anime[] = await this.prismaService.anime.findMany({
      where: whereQuery
    });

    const response: Anime[] = await this.prismaService.anime.findMany({
      take: limit,
      skip: offset,
      orderBy: [
        { avg_rating: 'desc'},
        { jp_title: 'asc' },
      ],
      where: whereQuery
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

  async findRecent() {
    const anime = await this.prismaService.anime.findMany({
      where: {
        recently_added: true
      },
      take: 10,
      skip: 0
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
