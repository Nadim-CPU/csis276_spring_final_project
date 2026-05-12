import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { SocketGateway } from '../socket/socket.gateway';
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
        private readonly accountService: AccountService,
        private readonly socketGateway: SocketGateway,
    ) {}

    
    /*  -------------------------------------------
    *   |        GENERIC CRUD OPERATIONS          |
    *   -------------------------------------------
    */

    async getExpenses(user_id: number) {
        return this.expenseRepository.find({
            where: { user_expense_id: user_id },
            order: { expense_id: 'ASC' },
        });
    }

    async getExpense(user_id: number, expense_id: number) {
        const expense = await this.expenseRepository.findOneBy({ 
            expense_id,
            user_expense_id: user_id,
         });
        if (!expense) {
            throw new NotFoundException(`Expense ID ${expense_id} is non-existent!`);
        }
        return expense;
    }

    async create(user_id: number, input: CreateExpenseInput) {
        const expense = this.expenseRepository.create({
            user_expense_id: user_id,
            expense_amount: input.expense_amount,
            expense_source: input.expense_source,
            expense_date: input.expense_date,
            category_expense_id: input.category_expense_id,
            account_expense_id: input.account_expense_id,
        });
        const saved = await this.expenseRepository.save(expense);

        // Negative sign because adjustbalance is called with .increment()
        await this.accountService.adjustBalance(input.account_expense_id, -input.expense_amount);

        this.socketGateway.broadcast('expense.changed', { user_id });
        return saved;
    }

    async update(user_id: number, id: number, input: UpdateExpenseInput) {
        const oldExpense = await this.getExpense(user_id, id);
        
        await this.expenseRepository.update({ expense_id: id, user_expense_id: user_id}, input);

        const updatedExpense = await this.getExpense(user_id, id);

        // Removes previous amount affecting account to prevent stacking
        await this.accountService.adjustBalance(
            oldExpense.account_expense_id,
            Number(oldExpense.expense_amount),
        );

        // Adds the new amount
        await this.accountService.adjustBalance(
            updatedExpense.account_expense_id,
            -Number(input.expense_amount),
        );

        this.socketGateway.broadcast('expense.changed', { user_id});
        return updatedExpense;
    }

    async remove(user_id: number, id: number) {
        const current = await this.getExpense(user_id, id);
        if (!current) {
            throw new NotFoundException(`Account ID ${id} is non-existent`);
        }
        // Refunds the amount back
        await this.accountService.adjustBalance(
            current.account_expense_id,
            Number(current.expense_amount),
        );

        await this.expenseRepository.delete(id);
        this.socketGateway.broadcast('expense.changed', { user_id });
    }
}
