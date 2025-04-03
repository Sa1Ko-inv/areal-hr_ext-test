const sequelize = require('../db')
const {DataTypes} = require("sequelize");
const Employee = require("../models/employees");
const Department = require("../models/department");
const Position = require("../models/position");

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
Employee.hasMany(HR_Operation, { foreignKey: 'employeeId' });
HR_Operation.belongsTo(Employee, { foreignKey: 'employeeId' });

// Связь с отделом
HR_Operation.belongsTo(Department, { foreignKey: 'departmentId' });

// Связь с должностью
HR_Operation.belongsTo(Position, { foreignKey: 'positionId' });

module.exports = HR_Operation