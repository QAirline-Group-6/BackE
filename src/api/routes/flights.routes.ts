import express from 'express'
const router = express.Router();
const flightController = require('../../controllers/flights.controller');

// Lấy tất cả chuyến bay
router.get('/', flightController.getAllFlights);

// Tạo chuyến bay mới
router.post('/', flightController.createFlight);

// Lấy 5 chuyến bay phổ biến nhất
router.get('/popular', flightController.getPopularFlights);

// Lấy chuyến bay theo ID
router.get('/:id', flightController.getFlightById);

// Cập nhật chuyến bay theo ID
router.put('/:id', flightController.updateFlight);

// Xoá chuyến bay theo ID
router.delete('/:id', flightController.deleteFlight);

export default router;
