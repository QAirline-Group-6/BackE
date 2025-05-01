import express from 'express'
const router = express.Router();
const flightController = require('../../controllers/flights.controller');
const authMiddleware = require('../middlewares/auth.middleware')


// Lấy tất cả chuyến bay
router.get('/', flightController.getAllFlights);

// Lấy 5 chuyến bay phổ biến nhất
router.get('/popular', flightController.getPopularFlights);

// Lấy chuyến bay theo ID
router.get('/:id', flightController.getFlightById);

// Cập nhật chuyến bay theo ID
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), flightController.updateFlight);

// Xoá chuyến bay theo ID
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), flightController.deleteFlight);

// Tạo chuyến bay (Khi user là admin)
router.post('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), flightController.createFlight
);

export default router;
