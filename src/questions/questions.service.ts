import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import * as md5 from 'md5';
import { Connection, Repository, getConnection } from 'typeorm';
import { Questions as QuestionsRepository } from './questions.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(QuestionsRepository) private QuestionsRepository: Repository<QuestionsRepository>
    ) { }

    async insertQuestion(question): Promise<any[]> {
        question.created_at = question.updated_at = moment().unix()
        question.hash = md5(question.question + question.category_slug)
        question.options = JSON.stringify(question.options)

        let result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(QuestionsRepository)
            .values([
                question
            ])
            .execute()
            .then((r: any) => {
                return r;
            })
            .catch((e: any) => {
                return { errno: e.code };
            });

        result = result.errno ? [false, result.errno] : [true, result];

        return result;



        // await getConnection().createQueryBuilder().insert().into(QuestionsRepository).values([
        //     question
        // ]).execute();
        // return true;
    }

    async getQuestions(query?: any): Promise<QuestionsRepository[]> {
        let filter: any = {};
        filter.is_active = 1;

        if (query.category_id) {
            filter.category_slug = query.category_slug
        }

        let limit = (query.perPage && query.perPage > 0 && query.perPage <= 50) ? query.perPage : 10;
        let page = (query.page && query.page > 0) ? query.page : 1;

        let skip = limit * (page - 1)

        let questions = await this.QuestionsRepository.find({
            select: ["question", "options", "correct_option", "explaination", "hash", "created_at", "updated_at", "category_slug"],
            where: [filter],
            take: limit,
            skip: skip
        });

        let finalResult = [];
        for (let i = 0; i < questions.length; i++) {
            finalResult[i] = questions[i];
            finalResult[i].options = JSON.parse(finalResult[i].options);
        }
        return finalResult;
    }

    async getQuestion(_id: string): Promise<QuestionsRepository[]> {
        let questions = await this.QuestionsRepository.find({
            select: ["question", "options", "correct_option", "explaination", "hash", "created_at", "updated_at", "category_slug"],
            where: [{ "hash": _id, "is_active": 1 }]
        });

        let finalResult = [];
        for (let i = 0; i < questions.length; i++) {
            finalResult[i] = questions[i];
            finalResult[i].options = JSON.parse(finalResult[i].options);
        }
        return finalResult;
    }

    async updateQuestion(question: QuestionsRepository) {
        this.QuestionsRepository.save(question)
    }

    async deleteQuestion(question: QuestionsRepository) {
        this.QuestionsRepository.delete(question);
    }

}
