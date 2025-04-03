const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const History = sequelize.define('history', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    operationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Дата и время операции
    operationObject: {
        type: DataTypes.ENUM('Organization', 'Department', 'Position', 'Employee', 'HROperation'),
        allowNull: false
    }, // Объект операции
    objectId: { type: DataTypes.INTEGER, allowNull: false }, // ID объекта
    changedFields: { type: DataTypes.JSON, allowNull: false }, // Измененные поля
    // authorId: { type: DataTypes.INTEGER, allowNull: false }
    // Автор изменения (пользователь)
});

// Связь с пользователем (автор изменения)
// User.hasMany(History, { foreignKey: 'authorId' });
// History.belongsTo(User, { foreignKey: 'authorId' });