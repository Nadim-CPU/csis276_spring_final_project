import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { OperationResult } from '../dto/operation-result';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';

@Resolver(() => Expense)
@UseGuards(GqlAuthGuard)
export class ExpenseResolver {
    constructor(private readonly expenseService: ExpenseService) {}

    @Query(() => [Expense], { name: 'expenses' })
    getExpenses(@Args('user_id', { type: () => Int }) user_id: number) {
        return this.expenseService.getExpenses(user_id);
    }

    @Query(() => Expense, { name: 'expense' })
    getExpense(@Args('id', { type: () => Int }) id: number) {
        return this.expenseService.getExpense(id);
    }

    @Mutation(() => Expense)
    createExpense(@Args('input') input: CreateExpenseInput) {
        return this.expenseService.create(input);
    }

    @Mutation(() => Expense)
    updateExpense(
        @Args('id', { type: () => Int }) id: number,
        @Args('input') input: UpdateExpenseInput,
    ) {
        return this.expenseService.update(id, input);
    }

    @Mutation(() => OperationResult)
    async removeExpense(@Args('id', { type: () => Int }) id: number) {
        await this.expenseService.remove(id);
        return { success: true };
    }
}
