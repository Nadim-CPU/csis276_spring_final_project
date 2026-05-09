import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCategoryInput {
    @Field()
    @IsNotEmpty({ message: 'error in category name' })
    category_name!: string;
}
