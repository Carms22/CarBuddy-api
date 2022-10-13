const router = require('express').Router();
const userController = require('../controllers/users.controller')

//MISC
router.get('/', (req, res, next) => res.json({ ok: true }));

//AUTH

//USER
router.get('/users', userController.list);
router.post('/users', userController.create);
router.get('/users/me', userController.getCurrentUser);

//JOURNEY


module.exports = router;