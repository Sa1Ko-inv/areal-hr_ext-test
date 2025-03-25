const sequelize = require('../db')
const {DataTypes} = require("sequelize");
const Organization = require("./organization");

const Department = sequelize.define("department", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false, unique: true, comment: "Название отдела"},
    comment: {type: DataTypes.TEXT, allowNull: true, comment: "Комментарий"},
    organization_id: {type: DataTypes.INTEGER, allowNull: false, comment: "ID организации"},
    parent_id: {type: DataTypes.INTEGER, allowNull: true, comment: "ID родительского отдела"},
}, {
    paranoid: true,
})

Organization.hasMany(Department, {foreignKey: 'organization_id'})
Department.belongsTo(Organization, {foreignKey: 'organization_id'})

Department.belongsTo(Department, { as: 'parent', foreignKey: 'parent_id' });
Department.hasMany(Department, { as: 'children', foreignKey: 'parent_id' });

module.exports = Department