const ExpenseService = require('../services/ExpenseService');


class ExpenseController {

    static async getExpenses(req, res, next) {
        try {
        const expenses = await ExpenseService.getExpenses(req.query.user_id);
        return res.status(201).json(expenses);
        } catch (e) {
        next(e);
        }

    }

    static async getExpense(req, res, next) {
        try {
            const expense = await ExpenseService.getExpense(req.params.id);
            return res.status(201).json(expense);
        } catch (e) {
            next(e);
        }
    }

    static async create(req, res, next) {
        try {
            const expense = await ExpenseService.create(req.body);
            return res.status(201).json(expense);
        } catch (e) {
            next(e);
        }
    }

    static async update(req, res, next) {
        try {
            const expense = await ExpenseService.update(req.params.id, req.body);
            return res.json(expense);
        } catch(e) {
            next(e);
        }
    }

    static async remove(req, res, next) {
        try {
            const removed = await ExpenseService.remove(req.params.id);
            return res.status(204).json(removed);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = ExpenseController;