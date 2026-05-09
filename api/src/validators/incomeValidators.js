const { body } = require('express-validator');
const validate = require('../middlewares/validate');

const incomeRules = [
    body('income_amount').notEmpty().isInt().withMessage(' error with income amount! '),
    body('income_date').notEmpty().isDate().withMessage(' error with income date!'),
    validate,
];


module.exports = { incomeRules };