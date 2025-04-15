const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const Position = sequelize.define("position", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false,
        // unique: true,
        comment: "Название должности"},
}, {
    paranoid: true
})

module.exports = Position