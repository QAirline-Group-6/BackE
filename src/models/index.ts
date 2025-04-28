import { Sequelize } from 'sequelize';
import { Dialect } from 'sequelize';
import dotenv from 'dotenv';

import UserModel, { User } from './user.model';
import FlightModel, { Flight } from './flight.model';
import BookingModel, { Booking } from './booking.model';

dotenv.config();

// Khởi tạo Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'your_database',
  process.env.DB_USER || 'your_user',
  process.env.DB_PASSWORD || 'your_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_DIALECT as Dialect) || 'mysql',
    logging: false, // Tắt log SQL ra console, bật thì để true
  }
);

// Khởi tạo model
const UserModelInstance = UserModel(sequelize);
const FlightModelInstance = FlightModel(sequelize);
const BookingModelInstance = BookingModel(sequelize);

// (Optional) Nếu bạn cần định nghĩa association giữa các bảng
// Ví dụ:
// UserModelInstance.hasMany(BookingModelInstance, { foreignKey: 'user_id' });
// BookingModelInstance.belongsTo(UserModelInstance, { foreignKey: 'user_id' });

const db = {
  sequelize,
  Sequelize,
  User: UserModelInstance,
  Flight: FlightModelInstance,
  Booking: BookingModelInstance,
};

export default db;
export { User, Flight, Booking };
