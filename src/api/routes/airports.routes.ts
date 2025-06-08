import express from 'express';
const router = express.Router();

const airportController = require('../../controllers/airports.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Lấy tất cả sân bay
router.get('/', airportController.getAllAirports);

// Tìm kiếm sân bay theo từ khóa ?q=...
router.get('/search', airportController.searchAirports);

// Lấy sân bay theo ID
router.get('/:id', airportController.getAirportById);

// Thêm sân bay mới
router.post(
    '/new',
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles('admin'),
    airportController.createAirport
);

// Cập nhật sân bay theo ID
router.put(
    '/update/:id',
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles('admin'),
    airportController.updateAirport
);

// Xoá sân bay theo ID
router.delete(
    '/del/:id',
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles('admin'),
    airportController.deleteAirport
);

export default router;
