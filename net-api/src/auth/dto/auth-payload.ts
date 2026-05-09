import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';

@ObjectType()
export class AuthPayload {
    @Field()
    authenticated!: boolean;

    @Field(() => User)
    user!: User;

    @Field()
    access_token!: string;
}
