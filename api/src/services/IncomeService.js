const IncomeRepository = require('../repositories/IncomeRepository')
const AccountRepository = require('../repositories/AccountRepository')
const UserRepository = require('../repositories/UserRepository')
const APIError = require('../middlewares/APIError')


class IncomeService {

    static async getIncomes(id) {
        const doesIDExist = await UserRepository.findByID(id);
        if (!doesIDExist) {
            throw APIError.notFound(`ID ${id} is non-existent!`);
        }
        return await IncomeRepository.getIncomes(id);
    }

    static async getIncome(id) {
        const income = await IncomeRepository.getIncome(id);
        if (!income) {
            throw APIError.notFound(`Income ID ${id} is non-existent!`);
        }
        return income;
    }

    static async create(data) {
        const doesIDExist = await UserRepository.findByID(data.user_id);
        if (!doesIDExist) {
            throw APIError.notFound(`ID ${data.user_id} is non-existent!`);
        }
        const income = await IncomeRepository.create(data);

        if (data.account_income_id) {
            await AccountRepository.adjustBalance(data.account_income_id, data.income_amount);
        }

        return income;
    }

    static async update(id, data) {
        const oldIncome = await IncomeRepository.getIncome(id);
        if (!oldIncome) {
            throw APIError.notFound(`Income ID ${id} is non-existent!`);
        }

        const updated = await IncomeRepository.update(id, data);

        if (oldIncome.account_income_id) {
            await AccountRepository.adjustBalance(oldIncome.account_income_id, -Number(oldIncome.income_amount));
        }
        if (updated.account_income_id) {
            await AccountRepository.adjustBalance(updated.account_income_id, Number(updated.income_amount));
        }

        return updated;
    }

    static async remove(id) {
        const income = await IncomeRepository.getIncome(id);
        if (!income) {
            throw APIError.notFound(`Income ID ${id} is non-existent!`);
        }

        if (income.account_income_id) {
            await AccountRepository.adjustBalance(income.account_income_id, -income.income_amount);
        }

        await IncomeRepository.remove(id);
    }
}

module.exports = IncomeService;
