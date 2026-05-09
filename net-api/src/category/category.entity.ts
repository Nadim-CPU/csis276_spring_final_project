import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'categories' })
@Index(['user_category_id', 'category_name'], { unique: true })
export class Category {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    category_id!: number;

    @Field(() => Int)
    @Column()
    user_category_id!: number;

    @Field()
    @Column()
    category_name!: string;

    @Field()
    @Column()
    type!: boolean;
}
