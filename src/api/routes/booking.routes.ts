import express from 'express'
const router = express.Router();
const bookingController = require('../../controllers/bookings.controller');

// Tạo booking mới
router.post('/', bookingController.createBooking);

// Lấy tất cả booking
router.get('/', bookingController.getAllBookings);

// Lấy booking theo ID
router.get('/:id', bookingController.getBookingById);

// Cập nhật booking
router.put('/:id', bookingController.updateBooking);

// Xóa booking
router.delete('/:id', bookingController.deleteBooking);

export default router;