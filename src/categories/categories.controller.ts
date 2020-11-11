import { Controller, Post, Body, Get, Put, Delete, Param, Headers, HttpException, HttpStatus } from '@nestjs/common';
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

    @Get(':slug')
    async get(@Param() params) {
        return this.utills.singleResultWarp(await this.service.getCategory(params.slug));
    }

    @Get(':slug/subcategories')
    async getSubcategories(@Param() params) {
        return this.utills.multiResultWarp(await this.service.getSubcategories(params.slug));
    }

    @Post('/')
    async add(@Body() payload, @Headers() headers) {
        let func = async () => {
            let result = await this.service.insertCategory(payload);

            if (result[0]) {
                return this.utills.successMessage()
            } else {
                return this.utills.errorMessage(result[1])
            }
        }

        if (headers && headers.authorization) {
            if (headers.authorization == "Bearer c965f7b686cbe55471d1968f35d416496eb2980b27f535f603c34442f699fe53") {
                return func();
            }
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    }

}
