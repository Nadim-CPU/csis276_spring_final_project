import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';
import { CurrentUser } from '../auth/current/current-user.decorator';

@Resolver(() => Expense)
@UseGuards(GqlAuthGuard)
export class ExpenseResolver {
    constructor(private readonly expenseService: ExpenseService) {}

    @Query(() => [Expense], { name: 'expenses' })
    getExpenses(@CurrentUser('user_id') user: number) {
        return this.expenseService.getExpenses(user);
    }

    @Query(() => Expense, { name: 'expense' })
    getExpense(@CurrentUser('user_id') user: number, @Args('id', { type: () => Int }) id: number) {
        return this.expenseService.getExpense(id, user);
    }

    @Mutation(() => Expense)
    createExpense(@CurrentUser('user_id') user: number, @Args('input') input: CreateExpenseInput) {
        return this.expenseService.create(user, input);
    }

    @Mutation(() => Expense)
    updateExpense(
        @CurrentUser('user_id') user: number,
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateExpenseInput,
    ) {
        return this.expenseService.update(user, id, input);
    }

    @Mutation(() => OperationResult)
    async removeExpense(@CurrentUser('user_id') user: number, @Args('id', { type: () => Int }) id: number) {
        await this.expenseService.remove(user, id);
        return { success: true };
    }
}
