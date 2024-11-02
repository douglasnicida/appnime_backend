import axios from "axios";
import { PrismaService } from "./service/prisma.service"
import { Anime } from "@prisma/client";


const prisma = new PrismaService();

function verifyIsRecent(anime_release_date_month : number, anime_release_date_year : number) {
    const date = new Date()

    if(anime_release_date_month - date.getMonth() < -2 && anime_release_date_year == date.getFullYear()){
      return true;
    }

    return false
  }

async function seed() {
  let animes_aux: any = [];
  
  let res = await axios.get('https://kitsu.io/api/edge/trending/anime');
  let trendingAnimes = res.data.data;

  animes_aux = animes_aux.concat(trendingAnimes);

  let i = 0;
  
  while (i < 1000) {
    res = await axios.get(`https://kitsu.io/api/edge/anime?page[limit]=20&page[offset]=${i*20}`);
    animes_aux = animes_aux.concat(res.data.data);
    i++;
  }

  console.log(animes_aux.length)

  const existingTitles = new Set<string>();
  let animeList: Anime[] = [];

  for(let anime of animes_aux) {
    let anime_aux = anime.attributes;
    
    if (!anime_aux) {
      console.warn("Anime attributes are undefined for:", anime.data.attributes);
      return;
    }
    
    let avgRating: number = anime_aux.averageRating ? anime_aux.averageRating / 10 : 0;
    
    const jp_title = anime_aux.titles.en_jp || '';
    const en_title = anime_aux.titles.en || jp_title;

    if (!existingTitles.has(jp_title)) {
      existingTitles.add(jp_title);

      let apiData: Anime = {
        id: anime_aux.id,
        description: anime_aux.description || '',
        jp_title: jp_title,
        en_title: en_title,
        ep_count: anime_aux.episodeCount ? anime_aux.episodeCount : 0,
        image: anime_aux.posterImage?.original || '',
        avg_rating: avgRating.toFixed(1),
        start_airing: anime_aux.startDate || '',
        finished_airing: anime_aux.endDate || '',
        type: anime_aux.ageRatingGuide || '',
        studio_name: null,
        recently_added: verifyIsRecent(
          Number(anime_aux.startDate?.split('-')[1] || 0),
          Number(anime_aux.startDate?.split('-')[0] || 0)
        ),
      };

      animeList.push(apiData);
    }
  };

  await prisma.anime.createMany({ data: animeList });
  
  const userExists = await prisma.user.findUnique({ where: { email: "admin@admin.com" } });
  if (!userExists) {
    await prisma.user.create({ data: {
      email: "admin@admin.com",
      name: "admin",
      password: "$2a$10$1i76xc6wiJ30kYcLu990vORWnN6S53aw1ovTggcHQ1tVGoXIua0l6"
    }});
  }
}

seed().then(() => {
  console.log("Database seeded");
  prisma.$disconnect();
});