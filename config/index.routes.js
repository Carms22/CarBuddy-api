const router = require('express').Router();
const userController = require('../controllers/users.controller');
const journeyController = require('../controllers/journey.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const bookingController =require('../controllers/booking.controller');
const miscController = require('../controllers/misc.controller');


//MISC
router.get('/', (req, res, next) => res.json({ ok: true }));

//AUTH
router.post('/login', authController.login);

//USER
router.get('/users', authMiddleware.isAuthenticated, userController.list);
router.post('/users', userController.create);
router.get('/users/me', authMiddleware.isAuthenticated,  userController.getCurrentUser);
router.get('/users/:id', authMiddleware.isAuthenticated, userController.detail);

//JOURNEY
router.get('/journeys', journeyController.list);
router.get('/journeys/:id', journeyController.detail);
router.post('/journeys', authMiddleware.isAuthenticated, journeyController.create);
//router.post("/journey/search", journeyController.doSearch);


//COMMENTS
router.post('/comments/:id', authMiddleware.isAuthenticated, journeyController.comment);

//Score
router.post('/scores/:id', authMiddleware.isAuthenticated, miscController.score);
router.get('/scores/:id', authMiddleware.isAuthenticated, miscController.getScore);

//BOOKING
router.post('/bookings/:id', authMiddleware.isAuthenticated, bookingController.createBooking)
router.get('/bookings/:id', authMiddleware.isAuthenticated, bookingController.bookingByJourney)
router.get('/bookings', authMiddleware.isAuthenticated, bookingController.bookingByUser)

//SEARCH
//router.get('/searchs', miscController.search)
router.get('/searchs', miscController.getJourneyFromSearch)



module.exports = router;