const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Files = sequelize.define(
  'files',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'название файла',
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'путь к файлу',
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID сотрудника',
    },
  },
  {
    paranoid: true,
  }
);

module.exports = Files;
