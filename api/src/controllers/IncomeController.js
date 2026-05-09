const IncomeService = require('../services/IncomeService')


class IncomeController {

    static async getIncomes(req, res, next) {
        try {
            const incomes = await IncomeService.getIncomes(req.query.user_id);
            return res.status(201).json(incomes);
        } catch (e) {
            next(e);
        }
    }

    static async getIncome(req, res, next) {
        try {
            const income = await IncomeService.getIncome(req.params.id);
            return res.status(201).json(income);
        } catch (e) {
            next(e);
        }
    }

    static async create(req, res, next) {
        try {
            const income = await IncomeService.create(req.body);
            return res.status(201).json(income);
        } catch (e) {
            next(e);
        }
    }

    static async update(req, res, next) {
        try {
            const income = await IncomeService.update(req.params.id, req.body);
            return res.json(income);
        } catch (e) {
            next(e);
        }
    }

    static async remove(req, res, next) {
        try {
            const removed = await IncomeService.remove(req.params.id);
            return res.status(204).json(removed);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = IncomeController;