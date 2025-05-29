import express from 'express'
const router = express.Router();
const flightController = require('../../controllers/flights.controller');
const authMiddleware = require('../middlewares/auth.middleware')


// Lấy tất cả chuyến bay
router.get('/', flightController.getAllFlights);

// Lấy 5 chuyến bay phổ biến nhất
router.get('/popular', flightController.getPopularFlights);

// Lấy chuyến bay theo điểm đi, điểm đến
router.get('/search', flightController.searchFlights);

// Cập nhật chuyến bay theo ID
router.put('/update/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), flightController.updateFlight);

// Xoá chuyến bay theo ID
router.delete('/del/:id',  flightController.deleteFlight);

// Tạo chuyến bay (Khi user là admin)
router.post('/new', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), flightController.createFlight
);

// Lấy chuyến bay theo ID
router.get('/:id', flightController.getFlightById);

// Lọc chuyến bay theo giá
router.get('/search', flightController.searchFlightsByPrice);

export default router;
