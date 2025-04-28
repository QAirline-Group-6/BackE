import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
  user_id: number;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin';
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'role'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public email!: string;
  public phone!: string;
  public password!: string;
  public role!: 'customer' | 'admin';

  // Nếu dùng timestamps, có thể thêm createdAt/updatedAt ở đây
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('customer', 'admin'),
        defaultValue: 'customer'
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false
    }
  );

  return User;
};
