const router = require('express').Router();
const userController = require('../controllers/users.controller');
const journeyController = require('../controllers/journey.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');
const bookingController =require('../controllers/booking.controller');
const miscController = require('../controllers/misc.controller');
const fileUpload = require('../config/cloudinary.config')


//MISC
router.get('/', (req, res, next) => res.json({ ok: true }));

//AUTH
router.post('/login', authController.login);

//USER
router.get('/users', authMiddleware.isAuthenticated, userController.list);
router.post('/users',fileUpload.single('image'), userController.create);
router.get('/users/me', authMiddleware.isAuthenticated,  userController.getCurrentUser);
router.get('/users/:id', authMiddleware.isAuthenticated, userController.detail);
router.get('/creators/:id', userController.getCreator);


//JOURNEY
router.get('/journeys', journeyController.list);
router.get('/journeys/:id', journeyController.detail);
router.get('/journeys/:id/creator', journeyController.listByUser);
router.post('/journeys', authMiddleware.isAuthenticated, journeyController.create);

//COMMENTS
router.post('/comments/:id', authMiddleware.isAuthenticated, journeyController.comment);

//Score
router.post('/scores/:id', authMiddleware.isAuthenticated, miscController.score);
router.get('/scores/:id', miscController.getScore);


//BOOKING
router.post('/bookings/:id', authMiddleware.isAuthenticated, bookingController.createBooking)
router.get('/bookings/:id', authMiddleware.isAuthenticated, bookingController.bookingByJourney)
router.get('/bookings', authMiddleware.isAuthenticated, bookingController.bookingByUser)

//SEARCH
router.get('/searchs', miscController.getJourneyFromSearch)



module.exports = router;