const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const Passport = sequelize.define("passport", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    series: {type: DataTypes.STRING, allowNull: false, comment: "Серия паспорта"},
    number: {type: DataTypes.STRING, allowNull: false, unique: true, comment: "Номер паспорта"},
    issued_by: {type: DataTypes.STRING, allowNull: false, comment: "Кем выдан"},
    issued_date: {type: DataTypes.DATE, allowNull: false, comment: "Дата выдачи"},
    division_code: {type: DataTypes.STRING, allowNull: false, comment: "Код подразделения"},
    employee_id: {type: DataTypes.INTEGER, allowNull: false, comment: "ID сотрудника"},
}, {
    paranoid: true
})

module.exports = Passport