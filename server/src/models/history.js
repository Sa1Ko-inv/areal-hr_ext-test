// models/history.js
const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const History = sequelize.define(
  'history',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    operation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Дата и время операции',
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID пользователя, выполнившего изменение (пока null)',
    }, // Будет связано с User model позже
    object_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        'Тип объекта (Организация, Отдел, Должность, Сотрудник, Кадровая операция)',
    },
    object_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'ID измененного объекта',
    },
    changed_fields: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment:
        "JSON-объект с измененными полями (ключ: имя поля, значение: {old: 'старое значение', new: 'новое значение'})",
    },
    operation_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Тип операции ('create', 'update', 'delete')",
    },
  },
  {
    tableName: 'histories', // Явно задаем имя таблицы
    timestamps: true, // Добавляет createdAt и updatedAt
    createdAt: 'operation_date', // Переименовываем createdAt в operationDate
    updatedAt: false, // Отключаем поле updatedAt, оно не нужно
  }
);

module.exports = History;
