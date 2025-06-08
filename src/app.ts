// app.ts
import express, { Express } from 'express';
import cors from 'cors';

// Initialize the app with proper typing
const app: Express = express();

// Configure CORS
app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3000', 'https://localhost:3002/admin/dashboard'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Import routes with proper typing
import flightRoutes from './api/routes/flights.routes'
import userRoutes from './api/routes/users.routes';
import bookingRoutes from './api/routes/booking.routes';
import aircraftRoutes from './api/routes/aircraft.routes';
import seatRoutes from './api/routes/seat.routes';
import customerRoutes from './api/routes/customer.routes';
import airportRoutes from './api/routes/airports.routes';
import ticketRoutes from './api/routes/ticket.routes';
import blogRoutes from './api/routes/blog.routes';
import dashboardRoutes from './api/routes/dashboard.routes';

// Use the routes with correct URL paths
app.use('/flights', flightRoutes);
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/aircrafts', aircraftRoutes);
app.use('/seats', seatRoutes);
app.use('/customers', customerRoutes);
app.use('/airports', airportRoutes);
app.use('/tickets', ticketRoutes);
app.use('/blogs', blogRoutes);
app.use('/dashboard', dashboardRoutes);

export default app;
