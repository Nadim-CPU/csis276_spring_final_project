import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateAccountInput {
    @Field()
    @IsNotEmpty({ message: 'error in account name' })
    account_name!: string;

    @Field()
    @IsNotEmpty({ message: 'error in account type' })
    account_type!: string;
}
