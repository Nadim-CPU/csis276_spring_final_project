import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    user_id!: number;

    @Field()
    @Column()
    user_first_name!: string;

    @Field()
    @Column()
    user_last_name!: string;

    @Field()
    @Column({ unique: true })
    user_email!: string;

    @Field()
    @Column('date')
    user_dob!: string;

    @Column()
    password_hash!: string;
}

export type PublicUser = Omit<User, 'password_hash'>;
