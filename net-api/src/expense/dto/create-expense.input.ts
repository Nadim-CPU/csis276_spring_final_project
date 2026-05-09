import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateExpenseInput {
    @Field(() => Int)
    @IsInt()
    user_id!: number;

    @Field(() => Int)
    @IsNumber({}, { message: 'error with expense amount' })
    expense_amount!: number;

    @Field()
    @IsNotEmpty({ message: 'expense source is required' })
    expense_source!: string;

    @Field()
    @IsDateString({}, { message: 'error with expense date' })
    expense_date!: string;

    @Field(() => Int)
    @IsInt()
    category_expense_id!: number;

    @Field(() => Int)
    @IsInt()
    account_expense_id!: number;
}
