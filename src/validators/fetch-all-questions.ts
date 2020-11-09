import { validate, validateOrReject, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, IsOptional, IsNumberString } from "class-validator";

export class FetchAllQuestions {
    @IsNumberString()
    @IsOptional()
    category_id?: number;

    @IsNumberString()
    @IsOptional()
    perPage?: number;

    @IsNumberString()
    @IsOptional()
    page?: number;
}
