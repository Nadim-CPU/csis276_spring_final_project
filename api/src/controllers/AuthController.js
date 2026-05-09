const AuthService = require('../services/AuthService');

class AuthController {
    
    static async register(req, res, next) {
        try {
            const user = await AuthService.register(req.body);
            return res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    static async login(req, res, next) {
        try {
            const user = await AuthService.login(req.body);
            return res.json({ authenticated: true, user });
        } catch(e) {
            next(e);
        }
    }
}

module.exports = AuthController;