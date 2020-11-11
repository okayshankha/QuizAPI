import { IsOptional, IsNumberString } from "class-validator";

export class FetchAllQuestions {
    @IsNumberString()
    @IsOptional()
    category_slug?: number;

    @IsNumberString()
    @IsOptional()
    perPage?: number;

    @IsNumberString()
    @IsOptional()
    page?: number;
}
