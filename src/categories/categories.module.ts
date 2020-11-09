import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Categories } from './categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { UtillsService } from 'src/utills/utills.service';

@Module({
  imports: [TypeOrmModule.forFeature([Categories])],
  providers: [CategoriesService, UtillsService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
