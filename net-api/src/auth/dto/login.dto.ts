import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'A valid Email is required' })
    user_email!: string;

    @IsNotEmpty({ message: 'Password is required' })
    password!: string;
}
