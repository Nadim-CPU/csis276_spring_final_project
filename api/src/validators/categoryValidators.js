const { body } = require('express-validator');
const validate = require('../middlewares/validate');


const categoryCreateRules = [
    body('category_name').notEmpty().withMessage(' error in category name'),
    body('type').isBoolean().notEmpty().withMessage(' error in category type'),
    validate,
];

const categoryUpdateRules = [
    body('category_name').notEmpty().withMessage(' error in category name'),
    validate,
];

module.exports = { categoryCreateRules, categoryUpdateRules };