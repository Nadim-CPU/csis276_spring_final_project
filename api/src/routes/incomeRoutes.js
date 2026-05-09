const { Router } = require('express');
const IncomeController = require('../controllers/IncomeController')
const { incomeRules } = require('../validators/incomeValidators')

const router = Router();

router.get('/', IncomeController.getIncomes);
router.get('/:id', IncomeController.getIncome);
router.post('/', incomeRules, IncomeController.create);
router.put('/:id', incomeRules, IncomeController.update);
router.delete('/:id', IncomeController.remove);


module.exports = router;