import { Controller, Post, Body, Get, Put, Delete, Param, Query, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { Examdeva } from 'src/data_source/examveda/examdeva';
import { UtillsService } from 'src/utills/utills.service';
import { QuestionsService } from './questions.service';
import fetch from 'node-fetch';
import got from 'got';
import { FetchAllQuestions } from 'src/validators/fetch-all-questions';
import { InsertQuestion } from 'src/validators/insert-question';

@Controller('questions')
export class QuestionsController {

    constructor(
        private service: QuestionsService,
        private utills: UtillsService
    ) { }

    @Get('/')
    async getAll(@Query() query: FetchAllQuestions) {
        return this.utills.multiResultWarp(await this.service.getQuestions(query), query);
    }

    @Get(':id')
    async get(@Param() params: { id: string }) {
        return this.utills.singleResultWarp(await this.service.getQuestion(params.id));
    }

    @Post('/')
    async add(@Body() payload: InsertQuestion) {
        let result = await this.service.insertQuestion(payload);

        if (result[0]) {
            return this.utills.successMessage()
        } else {
            return this.utills.errorMessage(result[1])
        }
    }

    @Post('/load_from_url')
    async loadFromUrl(@Body() payload, @Headers() headers) {
        let func = async () => {
            let parser: any = undefined
            let url: String = new String(payload.url);
            if (url.search('examveda.com')) {
                parser = new Examdeva();
            }

            return await parser.parse(payload.url, payload.category_id).then(async data => {

                let insertCount: number = 0;
                let errorResponse: any[] = [];
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    let {body}: any = await got.post('http://localhost:3000/questions', {
                        json: element
                    })

                    let response = JSON.parse(body);
                    if (response.status) {
                        insertCount++;
                    } else {
                        errorResponse.push(response);
                    }
                }

                return {
                    status: true,
                    insert_count: insertCount,
                    error_count: errorResponse.length,
                    error_responses: errorResponse
                }
            });
        }

        if (headers && headers.authorization) {
            if (headers.authorization == "Bearer c965f7b686cbe55471d1968f35d416496eb2980b27f535f603c34442f699fe53") {
                return func();
            }
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }


}
