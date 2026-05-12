import { Field, Float, InputType } from '@nestjs/graphql';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsEmail, IsNotEmpty,
    IsNumber,
    IsOptional,
    MinLength,
} from 'class-validator';

@InputType()
export class RegisterInput {
    @Field()
    @IsNotEmpty({ message: 'First name is required' })
    user_first_name!: string;

    @Field()
    @IsNotEmpty({ message: 'Last name is required' })
    user_last_name!: string;

    @Field()
    @IsEmail({}, { message: 'A valid Email is required' })
    user_email!: string;

    @Field()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password!: string;

    @Field()
    @IsDateString({}, { message: 'A valid date of birth is required' })
    user_dob!: string;

    @Field(() => [Float], { nullable: true })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(128)
    @ArrayMaxSize(128)
    @IsNumber({}, { each: true })
    face_descriptor?: number[];
}
