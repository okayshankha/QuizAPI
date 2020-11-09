import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { UtillsService } from 'src/utills/utills.service';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(
        private service: CategoriesService,
        private utills: UtillsService
    ) {

    }

    @Get('/')
    async getAll(@Param() params) {
        return this.utills.multiResultWarp(await this.service.getCategories());
    }

    @Get(':id')
    async get(@Param() params) {
        return this.utills.singleResultWarp(await this.service.getCategory(params.id));
    }

    @Get(':id/subcategories')
    async getSubcategories(@Param() params) {
        return this.utills.multiResultWarp(await this.service.getSubcategories(params.id));
    }

    @Post('/')
    async add(@Body() payload) {
        let result = await this.service.insertCategory(payload);
        
        if (result[0]) {
            return this.utills.successMessage()
        } else {
            return this.utills.errorMessage(result[1])
        }
    }

}
