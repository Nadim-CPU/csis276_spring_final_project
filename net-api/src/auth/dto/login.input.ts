import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
    @Field()
    @IsEmail({}, { message: 'A valid Email is required' })
    user_email!: string;

    @Field()
    @IsNotEmpty({ message: 'Password is required' })
    password!: string;
}
