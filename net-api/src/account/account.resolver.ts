import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { CurrentUser } from '../auth/current/current-user.decorator';

/*  -------------------------------------------
*   |             ACCOUNT RESOLVER            |
*   -------------------------------------------
*/

@Resolver(() => Account)
@UseGuards(GqlAuthGuard)
export class AccountResolver {
    constructor(private readonly accountService: AccountService) {}

    @Query(() => [Account], { name: 'accounts' })
    async getAccounts(@CurrentUser('user_id') user: number) {
        return this.accountService.getAccounts(user);
    }

    @Query(() => Account, { name: 'account' })
    async getAccount(@CurrentUser('user_id') user: number, @Args('id', { type: () => Int }) id: number) {
        return this.accountService.getAccount(user, id);
    }

    @Mutation(() => Account)
    async createAccount(@CurrentUser('user_id') user: number, @Args('input') input: CreateAccountInput) {
        return this.accountService.create(user, input);
    }

    @Mutation(() => Account)
    updateAccount(
        @CurrentUser('user_id') user: number,
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateAccountInput,
    ) {
        return this.accountService.update(user, id, input);
    }

    @Mutation(() => OperationResult)
    async removeAccount(@CurrentUser('user_id') user: number, @Args('id', { type: () => Int }) id: number) {
        await this.accountService.remove(user, id);
        return { success: true };
    }
}
