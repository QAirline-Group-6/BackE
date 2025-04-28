import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface BookingAttributes {
  booking_id: number;
  customer_id: number;
  user_id: number;
  flight_id: number;
  seat_id: number;
  booking_time: Date;
  status: 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'booking_id'> {}

export class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public booking_id!: number;
  public customer_id!: number;
  public user_id!: number;
  public flight_id!: number;
  public seat_id!: number;
  public booking_time!: Date;
  public status!: 'confirmed' | 'cancelled' | 'completed';
  public total_amount!: number;
}

export default (sequelize: Sequelize) => {
  Booking.init(
    {
      booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      booking_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'bookings',
      timestamps: false,
    }
  );

  return Booking;
};
