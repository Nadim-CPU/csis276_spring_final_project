const { body } = require('express-validator');
const validate = require('../middlewares/validate');


const expenseCreateRules = [
    body('expense_amount').notEmpty().isInt().withMessage(' error with expense amount! '),
    body('expense_date').notEmpty().isDate().withMessage(' error with expense date!'),
    validate,
];

const expenseUpdateRules = [
    body('expense_amount').notEmpty().isInt().withMessage(' error with expense amount! '),
    body('expense_date').notEmpty().isDate().withMessage(' error with expense date!'),
    validate,
]

module.exports = { expenseCreateRules, expenseUpdateRules }