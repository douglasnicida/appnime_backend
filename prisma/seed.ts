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


async function seed () {
    let { data } = await axios.get('https://kitsu.io/api/edge/trending/anime');

    let animes = data.data

    let animeList : Anime[] = []

    if(animes) {
        animes.map((anime : any) => {
          let anime_aux = anime.attributes
  
          let apiData : Anime = {
            id:  anime_aux.id,
            description: anime_aux.description,
            jp_title: anime_aux.titles.en_jp,
            en_title: anime_aux.titles.en ? anime_aux.titles.en : anime_aux.titles.en_jp,
            ep_count: anime_aux.episodeCount ? anime_aux.episodeCount : 0,
            image: anime_aux.posterImage.original,
            avg_rating: String(anime_aux.averageRating / 10),
            start_airing: String(anime_aux.startDate),
            finished_airing: String(anime_aux.endDate),
            type: anime_aux.ageRatingGuide,
            studio_name: null,
            recently_added: verifyIsRecent(Number(anime_aux.startDate.split('-')[1]), Number(anime_aux.startDate.split('-')[0])),
          }
        
          animeList.push(apiData)

        })
        await prisma.anime.createMany({data:  animeList})
        await prisma.user.create({data: {
          email: "admin@admin.com",
          name: "admin",
          password: "$2a$10$1i76xc6wiJ30kYcLu990vORWnN6S53aw1ovTggcHQ1tVGoXIua0l6"
        }})
      }
}

seed().then(() => {
    console.log("Database seeded");
    prisma.$disconnect();
})