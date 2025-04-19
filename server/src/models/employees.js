const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const Passport = require('./passport');
const Address = require('./address');
const Files = require('./file');
const { parse, format, isValid } = require('date-fns');

const Employees = sequelize.define(
  'employees',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    last_name: { type: DataTypes.STRING, allowNull: false, comment: 'Фамилия' },
    first_name: { type: DataTypes.STRING, allowNull: false, comment: 'Имя' },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Отчество',
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Дата рождения',
      get() {
        const rawValue = this.getDataValue('birth_date');
        return rawValue ? format(new Date(rawValue), 'dd/MM/yyyy') : null;
      },
      set(value) {
        if (typeof value === 'string') {
          const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
          if (isValid(parsedDate)) {
            this.setDataValue('birth_date', parsedDate);
          } else {
            throw new Error('Неверный формат даты. Используйте формат dd/MM/yyyy');
          }
        } else {
          this.setDataValue('birth_date', value);
        }
      },
    },
  },
  {
    paranoid: true,
  }
);

//связи
Employees.hasOne(Passport, { foreignKey: 'employee_id' });
Passport.belongsTo(Employees, { foreignKey: 'employee_id' });

Employees.hasOne(Address, { foreignKey: 'employee_id' });
Address.belongsTo(Employees, { foreignKey: 'employee_id' });

Employees.hasMany(Files, { foreignKey: 'employee_id' });
Files.belongsTo(Employees, { foreignKey: 'employee_id' });

module.exports = Employees;
