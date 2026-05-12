import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { CreateIncomeInput } from './dto/create-income.input';
import { UpdateIncomeInput } from './dto/update-income.input';
import { Income } from './income.entity';
import { IncomeService } from './income.service';
import { CurrentUser } from '../auth/current/current-user.decorator';

@Resolver(() => Income)
@UseGuards(GqlAuthGuard)
export class IncomeResolver {
    constructor(private readonly incomeService: IncomeService) {}

    @Query(() => [Income], { name: 'incomes' })
    getIncomes(@CurrentUser('user_id') user: number) {
        return this.incomeService.getIncomes(user);
    }

    @Query(() => Income, { name: 'income' })
    getIncome(@CurrentUser('user_id') user: number, @Args('id', { type: () => Int }) id: number) {
        return this.incomeService.getIncome(user, id);
    }

    @Mutation(() => Income)
    createIncome(@CurrentUser('user_id') user: number, @Args('input') input: CreateIncomeInput) {
        return this.incomeService.create(user, input);
    }

    @Mutation(() => Income)
    updateIncome(
        @CurrentUser('user_id') user: number,
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateIncomeInput,
    ) {
        return this.incomeService.update(user, id, input);
    }

    @Mutation(() => OperationResult)
    async removeIncome(@CurrentUser('user_id') user: number, @Args('id', { type: () => Int }) id: number) {
        await this.incomeService.remove(user, id);
        return { success: true };
    }
}
