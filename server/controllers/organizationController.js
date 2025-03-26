const Organization = require('../models/organization')

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

    async getAllOrganization(req, res, next) {
        try {
            const organizations = await Organization.findAll({paranoid: false});
            return res.json(organizations);
        } catch (error) {
            console.log('Ошибка при получении Организаций', error)
        }
    }

    async updateOrganization(req, res, next) {
        const {id} = req.params;
        const {name, comment} = req.body;

        try {
            const organization = await Organization.findByPk(id);
            await organization.update(
                {name, comment}
            )
            return res.json(organization);
        } catch (error) {
            console.log('Ошибка при обновлении Организации', error)

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