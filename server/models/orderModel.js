const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: { 
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), 
      defaultValue: 'pending' 
    },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  }, {
    tableName: 'orders',
    timestamps: true,
  });
};
