import express from 'express';
const router = express.Router();
const seatController = require('../../controllers/seat.controller');
const authMiddleware = require('../middlewares/auth.middleware')

// Lấy tất cả ghế
router.post('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'),seatController.createSeat);

// Lấy ghế theo id máy bay
router.get('/aircraft/:aircraft_id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), seatController.getSeatsByAircraft);

export default router;
