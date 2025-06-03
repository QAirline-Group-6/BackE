import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface TicketAttributes {
  ticket_id: number;
  booking_id: number;
  flight_id: number;
  seat_id: number;
  customer_id: number;
  price: number;
  status: 'booked' | 'cancelled' | 'checked_in';
}

interface TicketCreationAttributes extends Optional<TicketAttributes, 'ticket_id'> {}

export class Ticket extends Model<TicketAttributes, TicketCreationAttributes> implements TicketAttributes {
  public ticket_id!: number;
  public booking_id!: number;
  public flight_id!: number;
  public seat_id!: number;
  public customer_id!: number;
  public price!: number;
  public status!: 'booked' | 'cancelled' | 'checked_in';

  // timestamps will not be used
}

export default (sequelize: Sequelize) => {
  Ticket.init(
    {
      ticket_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('booked', 'cancelled', 'checked_in'),
        allowNull: false,
        defaultValue: 'booked'
      }
    },
    {
      sequelize,
      tableName: 'tickets',
      timestamps: false
    }
  );

  return Ticket;
};
