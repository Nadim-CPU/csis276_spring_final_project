import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';
import { Category } from '../category/category.entity';

@ObjectType()
@Entity({ name: 'incomes' })
export class Income {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    income_id!: number;

    @Field(() => Int)
    @Column()
    user_income_id!: number;

    @Field(() => Int)
    @Column()
    income_amount!: number;

    @Field()
    @Column()
    income_source!: string;

    @Field()
    @Column('date')
    income_date!: string;

    @Field(() => Int)
    @Column()
    category_income_id!: number;

    @Field(() => Int)
    @Column()
    account_income_id!: number;

    @Field(() => Category)
    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({ name: 'category_income_id' })
    category!: Category;

    @Field(() => Account)
    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: 'account_income_id' })
    account!: Account;
}
