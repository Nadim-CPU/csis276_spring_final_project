import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateIncomeInput {
    @Field(() => Int)
    @IsInt()
    user_id!: number;

    @Field(() => Float)
    @IsNumber({}, { message: 'error with income amount!' })
    income_amount!: number;

    @Field()
    @IsNotEmpty({ message: 'income source is required' })
    income_source!: string;

    @Field()
    @IsDateString({}, { message: 'error with income date!' })
    income_date!: string;

    @Field(() => Int)
    @IsInt()
    category_income_id!: number;

    @Field(() => Int)
    @IsInt()
    account_income_id!: number;
}
