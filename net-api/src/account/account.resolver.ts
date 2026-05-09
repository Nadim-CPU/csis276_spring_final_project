import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';

/*  -------------------------------------------
*   |             ACCOUNT RESOLVER            |
*   -------------------------------------------
*/

@Resolver(() => Account)
@UseGuards(GqlAuthGuard)
export class AccountResolver {
    constructor(private readonly accountService: AccountService) {}

    @Query(() => [Account], { name: 'accounts' })
    getAccounts(@Args('user_id', { type: () => Int }) user_id: number) {
        return this.accountService.getAccounts(user_id);
    }

    @Query(() => Account, { name: 'account' })
    getAccount(@Args('id', { type: () => Int }) id: number) {
        return this.accountService.getAccount(id);
    }

    @Mutation(() => Account)
    createAccount(@Args('input') input: CreateAccountInput) {
        return this.accountService.create(input);
    }

    @Mutation(() => Account)
    updateAccount(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateAccountInput,
    ) {
        return this.accountService.update(id, input);
    }

    @Mutation(() => OperationResult)
    async removeAccount(@Args('id', { type: () => Int }) id: number) {
        await this.accountService.remove(id);
        return { success: true };
    }
}
