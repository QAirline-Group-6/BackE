import express from 'express';
import { getSummary, getFlightStatus, getAircraftStatistics } from '../../controllers/dashboard.controller';

const router = express.Router();

router.get('/summary', getSummary);
router.get('/flight-status', getFlightStatus);
router.get('/aircraft-statistics', getAircraftStatistics);

export default router; 