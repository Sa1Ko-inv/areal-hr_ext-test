const sequelize = require('../db')
const {DataTypes} = require("sequelize");

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
    organization_id: {type: DataTypes.INTEGER, allowNull: true, comment: "ID организации"},
}, {
    paranoid: true
})

module.exports = HR_Operation