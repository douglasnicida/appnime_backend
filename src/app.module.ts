import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AnimesModule } from './modules/animes/animes.module';
import { UserAnimesModule } from './modules/user-animes/user-animes.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UsersModule, AnimesModule, UserAnimesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
