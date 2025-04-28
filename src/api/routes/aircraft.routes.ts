import express from 'express'
const router = express.Router();
const aircraftController = require('../../controllers/aircraft.controller');

// API: POST /api/aircrafts
router.post('/', aircraftController.createAircraft);

export default router;
