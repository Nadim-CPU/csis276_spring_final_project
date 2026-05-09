const AccountRepository = require('../repositories/AccountRepository');
const UserRepository = require('../repositories/UserRepository');
const APIError = require('../middlewares/APIError');


class AccountService {
    static async getAccounts(user_id) {
        const doesIDExist = await UserRepository.findByID(user_id);
        if (!doesIDExist) {
            throw APIError.notFound(`ID ${user_id} is non-existent!`);
        }
        return await AccountRepository.getAccounts(user_id);
    }

    static async getAccount(account_id) {
        const account = await AccountRepository.getAccount(account_id);
        if (!account) {
            throw APIError.notFound(`Account ID ${account_id} is non-existent!`);
        }
        return account;
    }

    static async create(data) {
        const doesIDExist = await UserRepository.findByID(data.user_id);
        if (!doesIDExist) {
            throw APIError.notFound(`ID ${data.user_id} is non-existent!`);
        }
        return await AccountRepository.create(data);
    }

    static async update(id, data) {
        const account = await AccountRepository.update(id, data);
        if (!account) {
            throw APIError.notFound(`Account ID ${id} is non-existent!`);
        }
        return account;
    }

    static async remove(id) {
        const removed = await AccountRepository.remove(id);
        if (!removed) {
            throw APIError.notFound(`Account ID ${id} is non-existent!`);
        }
    }
}

module.exports = AccountService;
