import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCategoryInput {
    @Field(() => Int)
    @IsInt()
    user_id!: number;

    @Field()
    @IsNotEmpty({ message: 'error in category name' })
    category_name!: string;

    @Field()
    @IsBoolean({ message: 'error in category type' })
    type!: boolean;
}
