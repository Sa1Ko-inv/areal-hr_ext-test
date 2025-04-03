const sequelize = require('../db');

// Импорт моделей
const Employees = require('./employees');
const Passport = require('./passport');
const Address = require('./address');
const Files = require('./file');

// Определение ассоциаций
Employees.hasOne(Passport, {foreignKey: 'employee_id'});
Passport.belongsTo(Employees, {foreignKey: 'employee_id'});

Employees.hasOne(Address, {foreignKey: 'employee_id'});
Address.belongsTo(Employees, {foreignKey: 'employee_id'});

Employees.hasMany(Files, {foreignKey: 'employee_id'});
Files.belongsTo(Employees, {foreignKey: 'employee_id'});

// Экспорт моделей и Sequelize
module.exports = {
    sequelize,
    Employees,
    Passport,
    Address,
    Files
};
