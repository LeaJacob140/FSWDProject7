const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    message: { type: DataTypes.STRING, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'notifications',
    timestamps: true,
  });
};
