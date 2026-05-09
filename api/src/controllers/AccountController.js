const AccountService = require('../services/AccountService');

class AccountController {

    static async getAccounts(req, res, next) {
        try {
            const accounts = await AccountService.getAccounts(req.query.user_id);
            return res.status(201).json(accounts);
        } catch (e) {
            next(e);
        }
    }

    static async getAccount(req, res, next) {
        try {
            const account = await AccountService.getAccount(req.params.id);
            return res.status(201).json(account);
        } catch (e) {
            next(e);
        }
    }

    static async create(req, res, next) {
        try {
            const account = await AccountService.create(req.body);
            return res.status(201).json(account);
        } catch (e) {
            next(e);
        }
    }

    static async update(req, res, next) {
        try {
            const account = await AccountService.update(req.params.id, req.body);
            return res.json(account);
        } catch (e) {
            next(e);
        }
    }

    static async remove(req, res, next) {
        try {
            const removed = await AccountService.remove(req.params.id);
            return res.status(204).json(removed);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = AccountController;
