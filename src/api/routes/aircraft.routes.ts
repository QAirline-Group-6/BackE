import express from 'express'
const router = express.Router();
const aircraftController = require('../../controllers/aircraft.controller');
const authMiddleware = require('../middlewares/auth.middleware')


// API: POST /api/aircrafts
router.post('/', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('admin'), aircraftController.createAircraft);

export default router;
