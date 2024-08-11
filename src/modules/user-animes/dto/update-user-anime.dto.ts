import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAnimeDto } from './create-user-anime.dto';

export class UpdateUserAnimeDto extends PartialType(CreateUserAnimeDto) {
  user_anime_rating: number;
  animeID: number;
}
