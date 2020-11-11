import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { getConnection, Repository } from 'typeorm';
import slugify from 'slugify';

import { Categories as CategoriesRepository } from './categories.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoriesRepository) private CategoriesRepository: Repository<CategoriesRepository>
    ) { }

    private getIdBySlug(slug?: string){
        if(!slug) return null;

        return this.CategoriesRepository.findOne({
            select: ["id"],
            where: [{ "slug": slug }]
        });
    }

    async getCategories(): Promise<CategoriesRepository[]> {
        let result: any[] = await this.CategoriesRepository.find({
            select: ["id", "name", "slug", "description", "created_at", "updated_at"],
            where: [{ "parent_id": null }]
        });

        console.log(result);
        

        for (let i = 0; i < result.length; i++) {
            result[i].subcategory_count = (await this.getSubcategories(result[i].slug)).length
        }

        return result;
    }

    async getCategory(slug: string): Promise<CategoriesRepository[]> {
        let result: any = await this.CategoriesRepository.find({
            select: ["id", "name", "slug", "description", "created_at", "updated_at"],
            where: [{ "slug": slug }]
        });

        for (let i = 0; i < result.length; i++) {
            result[i].subcategory_count = (await this.getSubcategories(result[i].slug)).length
        }

        return result;
    }

    async getSubcategories(slug: string): Promise<CategoriesRepository[]> {
        let parentID = await this.getIdBySlug(slug);

        let result: any = await this.CategoriesRepository.find({
            select: ["id", "name", "slug", "description", "created_at", "updated_at"],
            where: [{ "parent_id": parentID }]
        });

        for (let i = 0; i < result.length; i++) {
            result[i].subcategory_count = (await this.getSubcategories(result[i].id)).length
        }

        return result;
    }

    async insertCategory(category): Promise<any[]> {
        category.created_at = category.updated_at = moment().unix()

        let parentID = await this.getIdBySlug(category.parent_slug)

        let slug = parentID ? `${category.name}#${parentID}` : category.name

        category.slug = slugify(slug).toLowerCase();

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
