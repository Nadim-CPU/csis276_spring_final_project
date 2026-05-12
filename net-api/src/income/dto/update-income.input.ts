import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

@InputType()
export class UpdateIncomeInput {
    @Field(() => Int)
    @IsInt({ message: 'income amount must be a whole number' })
    @IsPositive({ message: 'income amount must be greater than zero' })
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
