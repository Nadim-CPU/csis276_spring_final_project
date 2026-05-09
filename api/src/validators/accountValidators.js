const { body } = require('express-validator');
const validate = require('../middlewares/validate');


const accountRules = [
    body('account_name').notEmpty().withMessage(' error in account name'),
    body('account_type').notEmpty().withMessage(' error in account type'),
    body('account_balance').notEmpty().isInt().withMessage(' error in account balance'),
    validate,
];

module.exports = { accountRules };
