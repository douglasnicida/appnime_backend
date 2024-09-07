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
import { PaginatedResult, Pagination } from 'src/decorators/pagination.decorator';

@Controller('animes')
export class AnimesController {
  constructor(private readonly animesService: AnimesService) {}

  @Post()
  async create(@Body() anime: CreateAnimeDto): Promise<MyResponse<void>> {
    await this.animesService.create(anime);

    return {
      status: HttpStatus.CREATED,
      message: 'Anime adicionado com sucesso.',
    };
  }

  @Get(':name')
  async find(@Param('name') name: string): Promise<MyResponse<Anime[]>> {
    const animes = await this.animesService.find(name);
    return {
      status: HttpStatus.FOUND,
      message: 'Animes were returned with success',
      payload: animes,
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
  async findAll(@Query('page') page: number, @Query('limit') limit: number, @Query('filters') filters?: string[]): Promise<MyResponse<PaginatedResult<Anime>>> {
    let pagination: Pagination = {
      page: Number(page),
      limit: Number(limit),
      offset: Number (page * limit)
    }

    console.log(page)

    let response = await this.animesService.findAll(pagination, filters)

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
