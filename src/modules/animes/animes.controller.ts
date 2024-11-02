import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AnimesService } from './animes.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { MyResponse } from 'src/interfaces/interfaces';
import { Anime } from '@prisma/client';
import { GetPagination, PaginatedResult, Pagination } from 'src/decorators/pagination.decorator';

@Controller('animes')
export class AnimesController {
  constructor(private readonly animesService: AnimesService) {}

  @Post()
  async create(@Body() createAnimeDTO: CreateAnimeDto): Promise<MyResponse<void>> {
    await this.animesService.create(createAnimeDTO);

    return {
      status: HttpStatus.CREATED,
      message: 'Anime adicionado com sucesso.',
    };
  }

  @Get('/recent')
  async findRecent(): Promise<any> {
    const recentAnimes: Anime[] = await this.animesService.findRecent();

    return {
      status: HttpStatus.FOUND,
      message: 'Anime was returned with success.',
      payload: recentAnimes
    };
  }

  @Get(':id')
  async findByID(@Param('id') id: string): Promise<MyResponse<Anime>> {
    const anime = await this.animesService.findByID(+id);

    return {
      status: HttpStatus.FOUND,
      message: 'Anime was returned with success',
      payload: anime,
    };
  }

  @Get()
  async findAll(@GetPagination() pagination : Pagination): Promise<MyResponse<PaginatedResult<Anime>>> {

    let response = await this.animesService.findAll(pagination)

    return {
      status: HttpStatus.FOUND,
      message: 'Animes were returned with success',
      payload: response,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animesService.remove(+id);
  }
}
