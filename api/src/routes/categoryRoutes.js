const { Router } = require('express');
const CategoryController = require('../controllers/CategoryController');
const { categoryCreateRules, categoryUpdateRules } = require('../validators/categoryValidators');

const router = Router();

router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategory);
router.post('/', categoryCreateRules, CategoryController.create);
router.put('/:id', categoryUpdateRules, CategoryController.update);
router.delete('/:id', CategoryController.remove);


module.exports = router;