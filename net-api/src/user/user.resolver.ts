import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => [User], { name: 'users' })
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.userService.findOne(id);
    }

    @Mutation(() => User)
    updateUser(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateUserInput,
    ) {
        return this.userService.update(id, input);
    }

    @Mutation(() => OperationResult)
    async removeUser(@Args('id', { type: () => Int }) id: number) {
        await this.userService.remove(id);
        return { success: true };
    }
}
