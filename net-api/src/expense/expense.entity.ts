import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../account/account.entity';
import { Category } from '../category/category.entity';

@ObjectType()
@Entity({ name: 'expenses' })
export class Expense {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    expense_id!: number;

    @Field(() => Int)
    @Column()
    user_expense_id!: number;

    @Field(() => Int)
    @Column()
    expense_amount!: number;

    @Field()
    @Column()
    expense_source!: string;

    @Field()
    @Column('date')
    expense_date!: string;

    @Field(() => Int)
    @Column()
    category_expense_id!: number;

    @Field(() => Int)
    @Column()
    account_expense_id!: number;

    @Field(() => Category)
    @ManyToOne(() => Category, { eager: true })
    @JoinColumn({ name: 'category_expense_id' })
    category!: Category;

    @Field(() => Account)
    @ManyToOne(() => Account, { eager: true })
    @JoinColumn({ name: 'account_expense_id' })
    account!: Account;
}
