import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';
import { CurrentUser } from 'src/auth/current/current-user.decorator';

/*  -------------------------------------------
*   |                USER RESOLVER            |
*   -------------------------------------------
*/
@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => User, { name: 'me' })
    findOne(@CurrentUser('user_id') user: number) {
        return this.userService.findOne(user);
    }

    @Mutation(() => User)
    updateUser(
        @CurrentUser('user_id') user: number,
        @Args('input') input: UpdateUserInput,
    ) {
        return this.userService.update(user, input);
    }

    @Mutation(() => OperationResult)
    async removeUser(@CurrentUser('user_id') user: number) {
        await this.userService.remove(user);
        return { success: true };
    }
}
