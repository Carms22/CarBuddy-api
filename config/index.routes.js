const router = require('express').Router();
const userController = require('../controllers/users.controller');
const journeyController = require('../controllers/journey.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');


//MISC
router.get('/', (req, res, next) => res.json({ ok: true }));

//AUTH
router.post('/login', authController.login);

//USER
router.get('/users', userController.list);
router.post('/users', userController.create);
router.get('/users/me', authMiddleware.isAuthenticated, userController.getCurrentUser);
router.get('/users/:id', userController.detail);

//JOURNEY
router.get('/journeys', journeyController.list);
router.get('/journeys/:id', authMiddleware.isAuthenticated, journeyController.detail);
router.post('/journeys', authMiddleware.isAuthenticated, journeyController.create);
//router.post("/journey/search", journeyController.doSearch);


//COMMENTS
router.post('/comments/:id', authMiddleware.isAuthenticated, journeyController.comment);

//Score
router.post('/scores/:id', authMiddleware.isAuthenticated, journeyController.score);



module.exports = router;