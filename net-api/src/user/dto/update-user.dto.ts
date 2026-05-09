import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty({ message: 'First name is required' })
    user_first_name!: string;

    @IsNotEmpty({ message: 'Last name is required' })
    user_last_name!: string;

    @IsEmail({}, { message: 'A valid Email is required' })
    user_email!: string;
}
