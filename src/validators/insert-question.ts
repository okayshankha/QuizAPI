import { IsString, ArrayMinSize, IsInt, IsNumberString } from "class-validator";


export class InsertQuestion {

    @IsString()
    question: string;


    @IsString({ each: true })
    @ArrayMinSize(2)
    options: [string]

    @IsString()
    category_slug: string;

    @IsString()
    correct_option: string;

    @IsString()
    explaination: string;
}
