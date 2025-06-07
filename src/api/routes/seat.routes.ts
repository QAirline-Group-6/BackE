import express from 'express';
const router = express.Router();
const seatController = require('../../controllers/seat.controller');
const authMiddleware = require('../middlewares/auth.middleware')
// Lấy tất cả ghế
router.get('/', seatController.getAllSeats)
router.post('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), seatController.createSeat);

// Lấy ghế theo id máy bay
router.get('/aircraft/:aircraft_id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), seatController.getSeatsByAircraft);

// Lấy ghế theo mã chuyến bay
router.get('/flight/:flightNumber', seatController.getSeatsByFlightNumber);

// Kiểm tra trạng thái ghế
router.get('/flight/:flightNumber/seat/:seatId/status', seatController.getSeatStatus);

// Khóa ghế
router.post('/flight/:flightNumber/seat/:seatId/lock', seatController.lockSeat);

export default router;
