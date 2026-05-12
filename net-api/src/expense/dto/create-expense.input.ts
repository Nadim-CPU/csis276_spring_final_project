import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

@InputType()
export class CreateExpenseInput {

    @Field(() => Int)
    @IsInt({ message: 'expense amount must be a whole number' })
    @IsPositive({ message: 'expense amount must be greater than zero' })
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
