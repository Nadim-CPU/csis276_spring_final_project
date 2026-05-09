import { IsDateString, IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'First name is required' })
    user_first_name!: string;

    @IsNotEmpty({ message: 'Last name is required' })
    user_last_name!: string;

    @IsEmail({}, { message: 'A valid Email is required' })
    user_email!: string;

    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password!: string;

    @IsOptional()
    @IsDateString()
    user_dob?: string;
}
