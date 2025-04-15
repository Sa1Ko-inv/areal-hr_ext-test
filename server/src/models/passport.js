const sequelize = require('../../db')
const {DataTypes} = require("sequelize");
const {format, parse, isValid} = require("date-fns");

const Passport = sequelize.define("passports", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    series: {type: DataTypes.STRING, allowNull: false, comment: "Серия паспорта"},
    number: {type: DataTypes.STRING, allowNull: false,
        // unique: true,
        comment: "Номер паспорта"},
    issued_by: {type: DataTypes.STRING, allowNull: false, comment: "Кем выдан"},
    issued_date: {type: DataTypes.DATE, allowNull: false, comment: "Дата выдачи",
        get() {
            const rawValue = this.getDataValue('issued_date');
            return rawValue ? format(new Date(rawValue), 'dd/MM/yyyy') : null;
        },
        set(value) {
            if (typeof value === 'string') {
                const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
                if (isValid(parsedDate)) {
                    this.setDataValue('issued_date', parsedDate);
                } else {
                    throw new Error('Неверный формат даты. Используйте формат dd/MM/yyyy');
                }
            } else {
                this.setDataValue('issued_date', value);
            }
        }},
    division_code: {type: DataTypes.STRING, allowNull: false, comment: "Код подразделения"},
    employee_id: {type: DataTypes.INTEGER, allowNull: false, comment: "ID сотрудника"},
}, {
    paranoid: true
})

module.exports = Passport