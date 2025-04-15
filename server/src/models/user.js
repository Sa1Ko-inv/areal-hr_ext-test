const sequelize = require('../../db')
const {DataTypes} = require("sequelize");

const User = sequelize.define("users", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    first_name: {type: DataTypes.STRING, allowNull: false, comment: "Имя"},
    last_name: {type: DataTypes.STRING, allowNull: false, comment: "Фамилия"},
    middle_name: {type: DataTypes.STRING, allowNull: false, comment: "Отчество"},
    login: {type: DataTypes.STRING, allowNull: false, comment: "Login"},
    password: {type: DataTypes.STRING, allowNull: false, comment: "пароль"},
    role: {type: DataTypes.ENUM('admin', 'hr_manager'), allowNull: false, comment: "Роль"},
}, {
    paranoid: true
})

module.exports = User