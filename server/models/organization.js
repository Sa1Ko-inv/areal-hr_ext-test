const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const Organization = sequelize.define("organization", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false,
        // unique: true,
        comment: "Название организации"},
    comment: {type: DataTypes.TEXT, allowNull: true, comment: "Комментарий"},
}, {
    paranoid: true
})

module.exports = Organization