const router = require('express').Router();
const userController = require('../controllers/users.controller');
const journeyController = require('../controllers/journey.controller');


//MISC
router.get('/', (req, res, next) => res.json({ ok: true }));

//AUTH

//USER
router.get('/users', userController.list);
router.post('/users', userController.create);
router.get('/users/me', userController.getCurrentUser);
router.get('/users/:id', userController.detail);

//JOURNEY
router.get('/journeys', journeyController.list);
router.get('/journeys/:id', journeyController.detail);

//Create-cpmment-score
router.post('/journeys', journeyController.create);
//router.post("/journey/search", journeyController.doSearch);


//COMMENTS
router.post('/comments/:id', journeyController.comment)



module.exports = router;