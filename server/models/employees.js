const sequelize = require('../db')
const {DataTypes} = require("sequelize");
const Passport = require("./passport");
const Address = require("./address");
const Files = require("./file");

const Employees = sequelize.define("employees", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    last_name: {type: DataTypes.STRING, allowNull: false, comment: "Фамилия"},
    first_name: {type: DataTypes.STRING, allowNull: false, comment: "Имя"},
    middle_name: {type: DataTypes.STRING, allowNull: false, comment: "Отчество"},
    birth_date: {type: DataTypes.DATE, allowNull: false, comment: "Дата рождения"},

}, {
    paranoid: true
})

//связи
Employees.hasOne(Passport, {foreignKey: 'employee_id'})
Passport.belongsTo(Employees, {foreignKey: 'employee_id'})

Employees.hasOne(Address, {foreignKey: 'employee_id'})
Address.belongsTo(Employees, {foreignKey: 'employee_id'})

Employees.hasMany(Files, {foreignKey: 'employee_id'})
Files.belongsTo(Employees, {foreignKey: 'employee_id'})

module.exports = Employees