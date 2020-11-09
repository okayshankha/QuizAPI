import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { CategoriesModule } from './categories/categories.module';
import { UtillsService } from './utills/utills.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    QuestionsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService, UtillsService],
})
export class AppModule {}
