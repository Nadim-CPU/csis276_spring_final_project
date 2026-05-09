const ExpenseRepository = require('../repositories/ExpenseRepository')
const AccountRepository = require('../repositories/AccountRepository')
const UserRepository = require('../repositories/UserRepository');
const APIError = require('../middlewares/APIError')


class ExpenseService {
    static async getExpenses(id) {
        const doesIDExist = await UserRepository.findByID(id);
        if (!doesIDExist) {
            throw APIError.notFound(`ID ${id} is non-existent!`);
        }
        return await ExpenseRepository.getExpenses(id);
    }

    static async getExpense(id) {
        const expense = await ExpenseRepository.getExpense(id);
        if (!expense) {
            throw APIError.notFound(`Expense ID ${id} is non-existent!`);
        }
        return expense;
    }

    static async create(data) {
        const doesIDExist = await UserRepository.findByID(data.user_id);
        if (!doesIDExist){
            throw APIError.notFound(`ID ${data.user_id} is non-existent!`);
        }
        const expense = await ExpenseRepository.create(data);

        if (data.account_expense_id) {
            await AccountRepository.adjustBalance(data.account_expense_id, -data.expense_amount);
        }

        return expense;
    }

    static async update(id, data) {
        const oldExpense = await ExpenseRepository.getExpense(id);
        if (!oldExpense) {
            throw APIError.notFound(`Expense ID ${id} is non-existent!`);
        }

        const updated = await ExpenseRepository.update(id, data);

        if (oldExpense.account_expense_id) {
            await AccountRepository.adjustBalance(oldExpense.account_expense_id, Number(oldExpense.expense_amount));
        }
        if (updated.account_expense_id) {
            await AccountRepository.adjustBalance(updated.account_expense_id, -Number(updated.expense_amount));
        }

        return updated;
    }

    static async remove(id) {
        const expense = await ExpenseRepository.getExpense(id);
        if (!expense) {
            throw APIError.notFound(`Expense ID ${id} is non-existent!`);
        }

        if (expense.account_expense_id) {
            await AccountRepository.adjustBalance(expense.account_expense_id, expense.expense_amount);
        }

        await ExpenseRepository.remove(id);
    }
}

module.exports = ExpenseService;
