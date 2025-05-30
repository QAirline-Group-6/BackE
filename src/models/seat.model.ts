import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface SeatAttributes {
  seat_id: number;
  aircraft_id: number;
  seat_number: string;
  seat_class: 'economy' | 'business';
}

interface SeatCreationAttributes extends Optional<SeatAttributes, 'seat_id'> {}

export class Seat extends Model<SeatAttributes, SeatCreationAttributes> implements SeatAttributes {
  public seat_id!: number;
  public aircraft_id!: number;
  public seat_number!: string;
  public seat_class!: 'economy' | 'business';
}

export default (sequelize: Sequelize) => {
  Seat.init(
    {
      seat_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      aircraft_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seat_class: {
        type: DataTypes.ENUM('economy', 'business'),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'seats',
      timestamps: false,
    }
  );

  return Seat;
};
