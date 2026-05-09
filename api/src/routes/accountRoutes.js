const { Router } = require('express');
const AccountController = require('../controllers/AccountController');
const { accountRules } = require('../validators/accountValidators');

const router = Router();

router.get('/', AccountController.getAccounts);
router.get('/:id', AccountController.getAccount);
router.post('/', accountRules, AccountController.create);
router.put('/:id', accountRules, AccountController.update);
router.delete('/:id', AccountController.remove);


module.exports = router;
