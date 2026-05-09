import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { CreateIncomeInput } from './dto/create-income.input';
import { UpdateIncomeInput } from './dto/update-income.input';
import { Income } from './income.entity';
import { IncomeService } from './income.service';

@Resolver(() => Income)
@UseGuards(GqlAuthGuard)
export class IncomeResolver {
    constructor(private readonly incomeService: IncomeService) {}

    @Query(() => [Income], { name: 'incomes' })
    getIncomes(@Args('user_id', { type: () => Int }) user_id: number) {
        return this.incomeService.getIncomes(user_id);
    }

    @Query(() => Income, { name: 'income' })
    getIncome(@Args('id', { type: () => Int }) id: number) {
        return this.incomeService.getIncome(id);
    }

    @Mutation(() => Income)
    createIncome(@Args('input') input: CreateIncomeInput) {
        return this.incomeService.create(input);
    }

    @Mutation(() => Income)
    updateIncome(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateIncomeInput,
    ) {
        return this.incomeService.update(id, input);
    }

    @Mutation(() => OperationResult)
    async removeIncome(@Args('id', { type: () => Int }) id: number) {
        await this.incomeService.remove(id);
        return { success: true };
    }
}
