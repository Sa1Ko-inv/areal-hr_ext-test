const sequelize = require('../db')
const {DataTypes} = require("sequelize");
const Organization = require("./Organization");

const Department = sequelize.define("Department", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true, comment: "Название отдела"},
    comment: {type: DataTypes.TEXT, allowNull: true, comment: "Комментарий"},
    organization_Id: {type: DataTypes.INTEGER, allowNull: false, comment: "ID организации"},
    parent_Id: {type: DataTypes.INTEGER, allowNull: true, comment: "ID родительского отдела"},
}, {
    paranoid: true
})

Organization.hasMany(Department, {foreignKey: 'organization_Id'})
Department.belongsTo(Organization, {foreignKey: 'organization_Id'})

Department.belongsTo(Department, { as: 'parent', foreignKey: 'parent_Id' });
Department.hasMany(Department, { as: 'children', foreignKey: 'parent_Id' });

module.exports = Department