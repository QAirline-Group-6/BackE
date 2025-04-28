import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface AircraftAttributes {
    aircraft_id: number;
    manufacturer: string;
    model: string;
    total_seats: number;
}

interface AircraftCreationAttributes extends Optional<AircraftAttributes, 'aircraft_id'> {}

export class Aircraft extends Model<AircraftAttributes, AircraftCreationAttributes> implements AircraftAttributes {
    public aircraft_id!: number;
    public manufacturer!: string;
    public model!: string;
    public total_seats!: number;
}

export default(sequelize: Sequelize) => {
    Aircraft.init(
        {
            aircraft_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: false,
            },
            manufacturer: {
                type: DataTypes.STRING,
                primaryKey: false,
            },
            model: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_seats: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'aircrafts',
            timestamps: false,
        }
    );
    return Aircraft;
}