import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { getConnection, Repository } from 'typeorm';
import { Categories as CategoriesRepository } from './categories.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoriesRepository) private CategoriesRepository: Repository<CategoriesRepository>
    ) { }

    async getCategories(): Promise<CategoriesRepository[]> {
        let result: any[] = await this.CategoriesRepository.find({
            select: ["id", "name", "description", "created_at", "updated_at"],
            where: [{ "parent_id": null }]
        });

        for (let i = 0; i < result.length; i++) {
            result[i].subcategory_count = (await this.getSubcategories(result[i].id)).length
        }

        return result;
    }

    async getCategory(_id: number): Promise<CategoriesRepository[]> {
        let result: any = await this.CategoriesRepository.find({
            select: ["id", "name", "description", "created_at", "updated_at"],
            where: [{ "id": _id }]
        });

        for (let i = 0; i < result.length; i++) {
            result[i].subcategory_count = (await this.getSubcategories(result[i].id)).length
        }

        return result;
    }

    async getSubcategories(_id: number): Promise<CategoriesRepository[]> {
        let result: any = await this.CategoriesRepository.find({
            select: ["id", "name", "description", "created_at", "updated_at"],
            where: [{ "parent_id": _id }]
        });

        for (let i = 0; i < result.length; i++) {
            result[i].subcategory_count = (await this.getSubcategories(result[i].id)).length
        }

        return result;
    }

    async insertCategory(category): Promise<any[]> {
        category.created_at = category.updated_at = moment().unix()

        let result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(CategoriesRepository)
            .values([
                category
            ])
            .execute()
            .then((r: any) => {
                return r;
            })
            .catch((e: any) => {
                return { errno: e.code };
            });

        result = result.errno ? [false, result.errno] : [true, result]
        return result
    }

    async updateCategory(category: CategoriesRepository) {
        this.CategoriesRepository.save(category)
    }

    async deleteCategory(category: CategoriesRepository) {
        this.CategoriesRepository.delete(category);
    }
}
