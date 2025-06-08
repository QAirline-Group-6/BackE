import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn('flights', 'price');
        await queryInterface.addColumn('flights', 'price_economy', {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: false,
            defaultValue: 0
        });
        await queryInterface.addColumn('flights', 'price_business', {
            type: DataTypes.DECIMAL(10, 0),
            allowNull: false,
            defaultValue: 0
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn('flights', 'price_economy');
        await queryInterface.removeColumn('flights', 'price_business');
        await queryInterface.addColumn('flights', 'price', {
            type: DataTypes.DECIMAL,
            allowNull: false,
            defaultValue: 0
        });
    }
}; 