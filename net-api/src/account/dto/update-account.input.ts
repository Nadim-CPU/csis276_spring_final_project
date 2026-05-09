import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateAccountInput {
    @Field()
    @IsNotEmpty({ message: 'error in account name' })
    account_name!: string;

    @Field()
    @IsNotEmpty({ message: 'error in account type' })
    account_type!: string;

    @Field(() => Int)
    @IsInt({ message: 'error in account balance' })
    account_balance!: number;
}
