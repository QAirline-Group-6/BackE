import express from 'express'
const router = express.Router();
const aircraftController = require('../../controllers/aircraft.controller');
const authMiddleware = require('../middlewares/auth.middleware')


// Tạo máy bay
router.post('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), aircraftController.createAircraft);

// Lấy danh sách máy bay 
router.get('/', aircraftController.getAllAircrafts);

// Cập nhật thông tin tàu bay
router.put('/update/:id', aircraftController.updateAircraft);

// Xóa tàu bay
router.delete('/del/:id', aircraftController.deleteAircraft);

export default router;
