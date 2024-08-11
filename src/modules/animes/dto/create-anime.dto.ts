export class CreateAnimeDto {
  jp_title: string;
  en_title: string;
  description?: string;
  start_airing?: string;
  finished_airing?: string;
  avg_rating: string;
  image: string;
  ep_count: number;
  type: string;
  recently_added: boolean;
  studio_name?: string;
}
