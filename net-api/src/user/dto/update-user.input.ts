import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateUserInput {
    @Field()
    @IsNotEmpty({ message: 'First name is required' })
    user_first_name!: string;

    @Field()
    @IsNotEmpty({ message: 'Last name is required' })
    user_last_name!: string;

    @Field()
    @IsEmail({}, { message: 'A valid Email is required' })
    user_email!: string;
}
