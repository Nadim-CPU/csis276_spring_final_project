import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from '../user/user.entity';
import { CreateExpenseInput } from './dto/create-expense.input';
import { UpdateExpenseInput } from './dto/update-expense.input';
import { Expense } from './expense.entity';

/*  -------------------------------------------
*   |               EXPENSE SERVICE           |
*   -------------------------------------------
*/
@Injectable()
export class ExpenseService {
    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly accountService: AccountService,
        private readonly socketGateway: SocketGateway,
    ) {}

    
    /*  -------------------------------------------
    *   |        GENERIC CRUD OPERATIONS          |
    *   -------------------------------------------
    */

    async getExpenses(user_id: number) {
        const userExists = await this.userRepository.findOneBy({ user_id });
        if (!userExists) {
            throw new NotFoundException(`ID ${user_id} is non-existent!`);
        }
        return this.expenseRepository.find({
            where: { user_expense_id: user_id },
            order: { expense_id: 'ASC' },
        });
    }

    async getExpense(id: number) {
        const expense = await this.expenseRepository.findOneBy({ expense_id: id });
        if (!expense) {
            throw new NotFoundException(`Expense ID ${id} is non-existent!`);
        }
        return expense;
    }

    async create(input: CreateExpenseInput) {
        const userExists = await this.userRepository.findOneBy({ user_id: input.user_id });
        if (!userExists) {
            throw new NotFoundException(`User ID ${input.user_id} is non-existent!`);
        }

        const expense = this.expenseRepository.create({
            user_expense_id: input.user_id,
            expense_amount: input.expense_amount,
            expense_source: input.expense_source,
            expense_date: input.expense_date,
            category_expense_id: input.category_expense_id,
            account_expense_id: input.account_expense_id,
        });
        const saved = await this.expenseRepository.save(expense);

        // Negative sign because adjustbalance is called with .increment()
        await this.accountService.adjustBalance(input.account_expense_id, -input.expense_amount);

        this.socketGateway.broadcast('expense.changed', { user_id: input.user_id });
        return this.getExpense(saved.expense_id);
    }

    async update(id: number, input: UpdateExpenseInput) {
        const oldExpense = await this.getExpense(id);

        await this.expenseRepository.update(id, {
            expense_amount: input.expense_amount,
            expense_source: input.expense_source,
            expense_date: input.expense_date,
            category_expense_id: input.category_expense_id,
            account_expense_id: input.account_expense_id,
        });

        // Removes previous amount affecting account to prevent stacking
        await this.accountService.adjustBalance(
            oldExpense.account_expense_id,
            Number(oldExpense.expense_amount),
        );

        // Adds the new amount
        await this.accountService.adjustBalance(
            input.account_expense_id,
            -Number(input.expense_amount),
        );

        this.socketGateway.broadcast('expense.changed', { user_id: oldExpense.user_expense_id });
        return this.getExpense(id);
    }

    async remove(id: number) {
        const expense = await this.getExpense(id);

        await this.accountService.adjustBalance(
            expense.account_expense_id,
            Number(expense.expense_amount),
        );

        await this.expenseRepository.delete(id);
        this.socketGateway.broadcast('expense.changed', { user_id: expense.user_expense_id });
    }
}
