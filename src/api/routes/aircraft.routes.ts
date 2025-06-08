import express from 'express';
const router = express.Router();
const aircraftController = require('../../controllers/aircraft.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Tạo máy bay mới (chỉ admin)
router.post('/new', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), aircraftController.createAircraft);

// Lấy danh sách máy bay (mọi người đều được xem)
router.get('/', aircraftController.getAllAircrafts);

// Cập nhật máy bay (chỉ admin)
router.put('/update/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), aircraftController.updateAircraft);

// Xóa máy bay (chỉ admin)
router.delete('/del/:id', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), aircraftController.deleteAircraft);

export default router;
