import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Questions } from './questions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtillsService } from 'src/utills/utills.service';

@Module({
  imports: [TypeOrmModule.forFeature([Questions])],
  providers: [QuestionsService, UtillsService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
