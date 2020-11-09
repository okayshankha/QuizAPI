import { Type } from "class-transformer/decorators";
import { IsNumberString, IsString, IsArray, ValidateNested, ArrayMinSize, IsInt } from "class-validator";


export class InsertQuestion {

    @IsString()
    question:string;


    @IsString({ each: true })
    @ArrayMinSize(2)
    options:[string]

    @IsInt()
    category_id:number;

    @IsString()
    correct_option:string;

    @IsString()
    explaination:string;
}
