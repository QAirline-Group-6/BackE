import { Sequelize } from 'sequelize';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

import UserModel, { User } from './user.model';
import FlightModel, { Flight } from './flight.model';
import BookingModel, { Booking } from './booking.model';
import AircraftModel, { Aircraft } from './aircraft.model';
import SeatModel, { Seat } from './seat.model';
import CustomerModel, { Customer } from './customer.model';
import AirportModel, { Airport } from './airport.model';
import TicketModel, { Ticket } from './ticket.model';

dotenv.config();

// Khởi tạo Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'plane',
  process.env.DB_USER || 'quocanh',
  process.env.DB_PASSWORD || '28012004',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: (process.env.DB_DIALECT as Dialect) || 'mysql',
    logging: false, // Tắt log SQL ra console, bật thì để true
  }
);

// Khởi tạo model
const UserModelInstance = UserModel(sequelize);
const FlightModelInstance = FlightModel(sequelize);
const BookingModelInstance = BookingModel(sequelize);
const AircraftModelInstance = AircraftModel(sequelize);
const SeatModelInstance = SeatModel(sequelize);
const CustomerModelInstance = CustomerModel(sequelize);
const AirportModelInstance = AirportModel(sequelize);
const TicketModelInstance = TicketModel(sequelize);

// Khai báo quan hệ
Booking.belongsTo(User, { foreignKey: 'user_id' });
Flight.belongsTo(Airport, { foreignKey: 'departure_airport_id', as: 'departureAirport' });
Flight.belongsTo(Airport, { foreignKey: 'destination_airport_id', as: 'destinationAirport'});
Flight.belongsTo(Aircraft, { foreignKey: 'aircraft_id', as: 'aircraft'});
Ticket.belongsTo(Booking, { foreignKey: 'booking_id' });
Ticket.belongsTo(Flight, { foreignKey: 'flight_id' });
Ticket.belongsTo(Seat, { foreignKey: 'seat_id' });
Ticket.belongsTo(Customer, { foreignKey: 'customer_id' });



Airport.hasMany(Flight, { foreignKey: 'departure_airport_id', as: 'DepartingFlights'});
Airport.hasMany(Flight, { foreignKey: 'destination_airport_id', as: 'ArrivingFlights'});
Aircraft.hasMany(Flight, { foreignKey: 'aircraft_id', as: 'Flights' });
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.hasMany(Ticket, { foreignKey: 'booking_id' });
Customer.hasMany(Ticket, { foreignKey: 'customer_id' });
Flight.hasMany(Ticket, { foreignKey: 'flight_id' });
Seat.hasMany(Ticket, { foreignKey: 'seat_id' });

const db = {
  sequelize,
  Sequelize,
  User: UserModelInstance,
  Flight: FlightModelInstance,
  Booking: BookingModelInstance,
  Aircraft: AircraftModelInstance,
  Seat: SeatModelInstance,
  Customer: CustomerModelInstance,
  Airport: AirportModelInstance,
  Ticket: TicketModelInstance,
};

export default db;
export { User, Flight, Booking, Aircraft, Seat, Customer, Airport, Ticket };
