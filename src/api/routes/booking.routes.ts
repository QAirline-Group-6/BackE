import express from 'express'

const router = express.Router();
const bookingController = require('../../controllers/bookings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware'); 
const bookingTypes = require('../../validations/booking.types');

// Đặt vé (khách)
router.post('/book', validationMiddleware.validateBody(bookingTypes.createBookingSchema), bookingController.createBooking);

// Lấy tất cả booking
router.get('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), bookingController.getAllBookings);

// Lấy tất cả vé
router.get('/ticket', authMiddleware.authenticateToken,   authMiddleware.authorizeRoles('admin'), bookingController.getAllTicket);

// Lấy booking theo ID
router.get('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), bookingController.getBookingById);

// Cập nhật booking (khách)
router.put('/update/:id', bookingController.updateBooking);

// Hủy đặt vé (khách)
router.put('/cancel/:id', bookingController.cancelBooking);

export default router;