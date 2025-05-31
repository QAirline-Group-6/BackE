import express from 'express';
const router = express.Router();
const airportController = require('../../controllers/airports.controller');

// Lấy tất cả sân bay
router.get('/', airportController.getAllAirports);

// Tìm kiếm sân bay theo từ khóa
router.get('/search', airportController.searchAirports);

// Lấy sân bay theo ID
router.get('/:id', airportController.getAirportById);

export default router; 