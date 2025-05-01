import express from 'express'
const router = express.Router();
const bookingController = require('../../controllers/bookings.controller');
const authMiddleware = require('../middlewares/auth.middleware')

// Đặt vé (khách)
router.post('/', bookingController.createBooking);

// Lấy tất cả booking
router.get('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), bookingController.getAllBookings);

// Lấy booking theo ID
router.get('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), bookingController.getBookingById);

// Cập nhật booking (khách)
router.put('/:id', bookingController.updateBooking);

// Hủy đặt vé (khách)
router.delete('/:id', bookingController.deleteBooking);

export default router;