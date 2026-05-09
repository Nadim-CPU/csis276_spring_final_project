import { Field, Float, InputType } from '@nestjs/graphql';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNumber,
} from 'class-validator';

@InputType()
export class LoginWithFaceInput {
    @Field()
    @IsEmail({}, { message: 'A valid Email is required' })
    user_email!: string;

    @Field(() => [Float])
    @IsArray()
    @ArrayMinSize(128)
    @ArrayMaxSize(128)
    @IsNumber({}, { each: true })
    descriptor!: number[];
}
