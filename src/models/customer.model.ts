import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CustomerAttributes {
  customer_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: Date;
  id_card_number: string;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'customer_id'> {}

export class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public customer_id!: number;
  public user_id!: number;
  public first_name!: string;
  public last_name!: string;
  public address!: string;
  public gender!: 'male' | 'female' | 'other';
  public date_of_birth!: Date;
  public id_card_number!: string;
}

export default (sequelize: Sequelize) => {
  Customer.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
        defaultValue: 'other',
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_card_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'customers',
      timestamps: false,
    }
  );

  return Customer;
};
