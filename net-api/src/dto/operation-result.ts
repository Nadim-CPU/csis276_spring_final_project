import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OperationResult {
    @Field()
    success!: boolean;

    @Field(() => String, { nullable: true })
    message?: string;
}
