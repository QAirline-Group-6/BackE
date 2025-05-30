import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface AirportAttributes {
    airport_id: number;
    code: string;
    name: string;
    city: string;
    country: string;
}

interface AirportCreationAttributes extends Optional<AirportAttributes, "airport_id"> {}  


export class Airport extends Model<AirportAttributes, AirportCreationAttributes> implements AirportAttributes {
    public airport_id!: number;
    public code!: string;
    public name!: string;
    public city!: string;
    public country!: string;
}
export default(sequelize: Sequelize) => {
    Airport.init(
        {
            airport_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            country: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: 'aircrafts',
            timestamps: false,
        }
    );
    return Airport;
}