// Исправить ошибку при созданни пользователя в Postman
const Employees = require('../models/employees');
const Passport = require('../models/passport');
const Address = require('../models/address');
const Files = require('../models/file');
const path = require('path');
const sequelize = require('../db');
const fs = require('fs');
const uuid = require('uuid');

class EmployeeController {
    async createEmployee(req, res, next) {
        try {
            // Получаем данные сотрудника из запроса
            const {
                last_name, first_name, middle_name, birth_date,
                passport, address
            } = req.body;

            // Создаем запись сотрудника
            const employee = await Employees.create({
                last_name,
                first_name,
                middle_name,
                birth_date
            });

            // Создаем запись паспорта
            if (passport) {
                await Passport.create({
                    ...passport,
                    employee_id: employee.id
                });
            }

            // Создаем запись адреса
            if (address) {
                await Address.create({
                    ...address,
                    employee_id: employee.id
                });
            }

            /// Обрабатываем загрузку файлов
            const uploadedFiles = [];
            if (req.files && req.files.files) {
                // Преобразуем в массив, даже если это один файл
                const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

                for (const file of files) {
                    try {
                        // Проверяем расширение файла
                        const fileExt = path.extname(file.name).toLowerCase();
                        if (fileExt !== '.jpg' && fileExt !== '.jpeg') {
                            console.log('Неподдерживаемый формат файла:', file.name);
                            continue;
                        }

                        // Создаем уникальное имя файла
                        const fileName = uuid.v4() + fileExt;
                        const filePath = path.resolve(__dirname, '..', 'static', fileName);

                        // Сохраняем файл
                        await file.mv(filePath);

                        // Создаем запись о файле в БД
                        const fileRecord = await Files.create({
                            name: file.name,
                            file_url: fileName,
                            employee_id: employee.id
                        });

                        uploadedFiles.push(fileRecord);
                    } catch (fileError) {
                        console.log('Ошибка при обработке файла', fileError);
                    }
                }
            }


            // Получаем созданного сотрудника со всеми связанными данными
            const createdEmployee = await Employees.findOne({
                where: { id: employee.id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            });

            return res.status(201).json(createdEmployee);
        } catch (error) {
            console.log('Ошибка при создании сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async getAllEmployees(req, res, next) {
        try {
            const employees = await Employees.findAll({
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            });
            return res.json(employees);
        } catch (error) {
            console.log('Ошибка при получении всех сотрудников', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async getOneEmployee(req, res, next) {
        const { id } = req.params;
        try {
            const employee = await Employees.findOne({
                where: { id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            });

            if (!employee) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            return res.json(employee);
        } catch (error) {
            console.log('Ошибка при получении сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async updateEmployee(req, res, next) {
        const { id } = req.params;
        try {
            const employee = await Employees.findOne({
                where: { id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            });

            if (!employee) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            // Обновляем данные сотрудника
            const { last_name, first_name, middle_name, birth_date, passport, address } = req.body;

            await employee.update({
                last_name: last_name || employee.last_name,
                first_name: first_name || employee.first_name,
                middle_name: middle_name || employee.middle_name,
                birth_date: birth_date || employee.birth_date
            });

            // Обновляем паспорт
            if (passport && employee.passport) {
                await employee.passport.update(passport);
            } else if (passport) {
                await Passport.create({
                    ...passport,
                    employee_id: employee.id
                });
            }

            // Обновляем адрес
            if (address && employee.address) {
                await employee.address.update(address);
            } else if (address) {
                await Address.create({
                    ...address,
                    employee_id: employee.id
                });
            }

            // Обрабатываем новые файлы
            if (req.files) {
                const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

                for (const file of files) {
                    // Проверяем расширение файла
                    const fileExt = path.extname(file.name).toLowerCase();
                    if (fileExt !== '.jpg' && fileExt !== '.jpeg' && fileExt !== '.png') {
                        continue; // Пропускаем файлы не jpg формата
                    }

                    // Создаем уникальное имя файла
                    const fileName = uuid.v4() + fileExt;
                    const filePath = path.resolve(__dirname, '..', 'static', fileName);

                    // Сохраняем файл
                    await file.mv(filePath);

                    // Создаем запись о файле в БД
                    await Files.create({
                        name: file.name,
                        file_url: fileName,
                        employee_id: employee.id
                    });
                }
            }

            // Получаем обновленного сотрудника
            const updatedEmployee = await Employees.findOne({
                where: { id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            });

            return res.json(updatedEmployee);
        } catch (error) {
            console.log('Ошибка при обновлении сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async deleteEmployee(req, res, next) {
        const { id } = req.params;
        // Создаем транзакцию для обеспечения целостности данных
        const transaction = await sequelize.transaction();

        try {
            // Находим сотрудника
            const employee = await Employees.findOne({
                where: { id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ],
                transaction
            });

            if (!employee) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            // Удаляем связанные записи (мягкое удаление)
            // Паспорт
            if (employee.passport) {
                await employee.passport.destroy({ transaction });
            }

            // Адрес
            if (employee.address) {
                await employee.address.destroy({ transaction });
            }

            // Файлы
            if (employee.files && employee.files.length > 0) {
                for (const file of employee.files) {
                    await file.destroy({ transaction });
                }
            }

            // Удаляем самого сотрудника (мягкое удаление)
            await employee.destroy({ transaction });

            // Фиксируем транзакцию
            await transaction.commit();

            return res.json({
                message: 'Сотрудник и все связанные данные успешно удалены (мягкое удаление)',
                employeeId: id
            });
        } catch (error) {
            // Откатываем транзакцию в случае ошибки
            await transaction.rollback();
            console.log('Ошибка при удалении сотрудника', error);
            return res.status(500).json({
                error: 'Ошибка сервера',
                details: error.message
            });
        }
    }

    // УДАЛИТЬ ПОСЛЕ РАЗРАБОТКИ

    async hardDeleteEmployee(req, res, next) {
        const { id } = req.params;
        try {
            // Находим сотрудника, включая удаленные записи
            const employee = await Employees.findOne({
                where: { id },
                include: [{ model: Files }],
                paranoid: false
            });

            if (!employee) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            // Удаляем физические файлы с сервера
            if (employee.files && employee.files.length > 0) {
                for (const file of employee.files) {
                    const filePath = path.resolve(__dirname, '..', 'static', file.file_url);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }

            // Полное удаление сотрудника и связанных записей из БД
            await employee.destroy({ force: true });

            return res.json({ message: 'Сотрудник и все связанные данные полностью удалены' });
        } catch (error) {
            console.log('Ошибка при полном удалении сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async deleteFile(req, res, next) {
        const { id } = req.params;
        try {
            const file = await Files.findByPk(id);

            if (!file) {
                return res.status(404).json({ error: 'Файл не найден' });
            }

            // Мягкое удаление файла (физический файл остается на сервере)
            await file.destroy();

            return res.json({ message: 'Файл успешно удален (мягкое удаление)' });
        } catch (error) {
            console.log('Ошибка при удалении файла', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async hardDeleteFile(req, res, next) {
        const { id } = req.params;
        try {
            // Находим файл, включая удаленные записи
            const file = await Files.findByPk(id, { paranoid: false });

            if (!file) {
                return res.status(404).json({ error: 'Файл не найден' });
            }

            // Удаляем физический файл с сервера
            const filePath = path.resolve(__dirname, '..', 'static', file.file_url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Полное удаление записи о файле из БД
            await file.destroy({ force: true });

            return res.json({ message: 'Файл полностью удален' });
        } catch (error) {
            console.log('Ошибка при полном удалении файла', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async restoreEmployee(req, res, next) {
        const { id } = req.params;
        try {
            // Находим удаленного сотрудника
            const employee = await Employees.findOne({
                where: { id },
                paranoid: false
            });

            if (!employee) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            if (!employee.deletedAt) {
                return res.status(400).json({ error: 'Сотрудник не был удален' });
            }

            // Восстанавливаем сотрудника
            await employee.restore();

            // Восстанавливаем связанные записи
            await Passport.restore({ where: { employee_id: id } });
            await Address.restore({ where: { employee_id: id } });
            await Files.restore({ where: { employee_id: id } });

            // Получаем восстановленного сотрудника со всеми связанными данными
            const restoredEmployee = await Employees.findOne({
                where: { id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            });

            return res.json({
                message: 'Сотрудник и все связанные данные успешно восстановлены',
                employee: restoredEmployee
            });
        } catch (error) {
            console.log('Ошибка при восстановлении сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async restoreFile(req, res, next) {
        const { id } = req.params;
        try {
            // Находим удаленный файл
            const file = await Files.findOne({
                where: { id },
                paranoid: false
            });

            if (!file) {
                return res.status(404).json({ error: 'Файл не найден' });
            }

            if (!file.deletedAt) {
                return res.status(400).json({ error: 'Файл не был удален' });
            }

            // Восстанавливаем файл
            await file.restore();

            return res.json({
                message: 'Файл успешно восстановлен',
                file
            });
        } catch (error) {
            console.log('Ошибка при восстановлении файла', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}

module.exports = new EmployeeController();
