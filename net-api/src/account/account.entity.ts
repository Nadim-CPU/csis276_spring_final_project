import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/*  -------------------------------------------
*   |               ACCOUNT ENTITY            |
*   -------------------------------------------
*/

@ObjectType()
@Entity({ name: 'accounts' })
@Index(['user_account_id', 'account_name'], { unique: true})
export class Account {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    account_id!: number;

    @Field(() => Int)
    @Column()
    user_account_id!: number;

    @Field()
    @Column()
    account_name!: string;

    @Field()
    @Column()
    account_type!: string;
    
    @Field(() => Int)
    @Column()
    account_balance!: number;
}
