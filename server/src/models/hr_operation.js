const sequelize = require('../../db')
const {DataTypes} = require("sequelize");
const Employee = require("./employees");
const Department = require("./department");
const Position = require("./position");

const HR_Operation = sequelize.define("hr_operation", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {
        type: DataTypes.ENUM(
            'hire',         // Принятие на работу
            'salary_change', // Изменение зарплаты
            'department_change', // Изменение отдела
            'fire'          // Увольнение
        ),
        allowNull: false,
        comment: "Тип операции",
    },
    salary: { type: DataTypes.INTEGER, allowNull: true, comment: "Зарплата" },
    employee_id: {type: DataTypes.INTEGER, allowNull: false, comment: "ID сотрудника"},
    position_id: {type: DataTypes.INTEGER, allowNull: true, comment: "ID должности"},
    department_id: {type: DataTypes.INTEGER, allowNull: true, comment: "ID отдела"},
}, {
    paranoid: true
})

// Связь с сотрудником
Employee.hasMany(HR_Operation, { foreignKey: 'employee_id' });
HR_Operation.belongsTo(Employee, { foreignKey: 'employee_id' });

// Связь с отделом
HR_Operation.belongsTo(Department, { foreignKey: 'department_id' });

// Связь с должностью
HR_Operation.belongsTo(Position, { foreignKey: 'position_id' });

module.exports = HR_Operation