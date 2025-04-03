const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const Address = sequelize.define("addresses", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    region: {type: DataTypes.STRING, allowNull: false, comment: "Регион"},
    locality: {type: DataTypes.STRING, allowNull: false, comment: "Населенный пункт"},
    street: {type: DataTypes.STRING, allowNull: false, comment: "Улица"},
    house: {type: DataTypes.STRING, allowNull: false, comment: "Дом"},
    building: {type: DataTypes.STRING, allowNull: false, comment: "Корпус"},
    apartment: {type: DataTypes.STRING, allowNull: false, comment: "Квартира"},
    employee_id: {type: DataTypes.INTEGER, allowNull: false, comment: "ID сотрудника"},
}, {
    paranoid: true
})


module.exports = Address