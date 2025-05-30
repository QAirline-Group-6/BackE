import express from 'express'
const router = express.Router();
const flightController = require('../../controllers/flights.controller');
const authMiddleware = require('../middlewares/auth.middleware')


// Lấy tất cả chuyến bay
router.get('/searchAll', flightController.getAllFlights);

// Lấy 5 chuyến bay phổ biến nhất
router.get('/popular', flightController.getPopularFlights);

// Lấy chuyến bay theo điểm đi, điểm đến: searchDes?from=1&&to=2
router.get('/searchDes', flightController.searchFlightsByDes);

// Cập nhật chuyến bay theo ID
router.put('/update/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), flightController.updateFlight);

// Xoá chuyến bay theo ID
router.delete('/del/:id',  flightController.deleteFlight);

// Tạo chuyến bay (Khi user là admin)
router.post('/new', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), flightController.createFlight
);

// Lấy chuyến bay theo ID
router.get('/:id', flightController.getFlightById);

// Lọc chuyến bay theo giá: ?minPrice=1000000&maxPrice=5000000
router.get('/searchPrice', flightController.searchFlightsByPrice);

export default router;
