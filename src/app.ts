// app.ts
import express, { Express } from 'express';
import cors from 'cors';

// Initialize the app with proper typing
const app: Express = express();

app.use(cors());
app.use(express.json());

// Import routes with proper typing
import flightRoutes from './api/routes/flights.routes'
import userRoutes from './api/routes/users.routes';
import bookingRoutes from './api/routes/booking.routes';

// Use the routes with correct URL paths
app.use('/api/flights', flightRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);

export default app;
