const Organization = require('../models/organization')
// const {department} = require('../models/department')
const Department = require("../models/department");

class OrganizationController {
    async createOrganization(req, res, next) {
        const {name, comment} = req.body;
        try {
            const organization = await Organization.create(
                {name, comment})

            return res.json(organization);

        } catch (error) {
            console.log('Ошибка при создании Организации', error)
        }
    }

    // Получение всех организаций
    async getAllOrganization(req, res, next) {
        try {
            const organizations = await Organization.findAll({paranoid: false});
            return res.json(organizations);
        } catch (error) {
            console.log('Ошибка при получении Организаций', error)
        }
    }

    // Получение организации по ID с ее отделами
    async getOrganizationWithDepartments(req, res, next) {
        try {
            const {id} = req.params;
            const organization = await Organization.findOne({
                where: {id: id},
                paranoid: false,
                include: [{
                    model: Department,
                    as: 'departments',
                    paranoid: false,
                    where: {parent_id: null},
                    required: false,
                    include: [
                        {
                            model: Department,
                            as: 'children',
                            paranoid: false,
                            hierarchy: true
                        }
                    ]
                }]
            });

            if (organization) {
                return res.json(organization);
            } else {
                return res.status(404).json({ error: 'Организация не найдена' });
            }
        } catch (error) {
            console.log('Ошибка при получении Организации', error)
        }
    }

    async updateOrganization(req, res, next) {
        const {id} = req.params;
        const {name, comment} = req.body;

        try {
            const organization = await Organization.findOne({
                where: {id: id},
                paranoid: false // Ищем даже удаленные записи
            });

            if (!organization) {
                return res.status(404).json({ error: 'Организация не найдена' });
            }

            await organization.update({name, comment});
            return res.json(organization);
        } catch (error) {
            console.log('Ошибка при обновлении Организации', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async deleteOrganization(req, res, next) {
        const {id} = req.params;

        try {
            const organization = await Organization.findByPk(id);
            await organization.destroy();
            return res.json({message: 'Организация удалена'});
        } catch (error) {
            console.log('Ошибка при удалении Организации', error)
        }
    }
}

module.exports = new OrganizationController();