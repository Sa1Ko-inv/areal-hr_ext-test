// Исправить ошибку при созданни пользователя в Postman
// const Employees = require('../models/employees');
// const Passport = require('../models/passport');
// const Address = require('../models/address');
// const Files = require('../models/file');
// const path = require('path');
// const sequelize = require('../db');
// const fs = require('fs');
// const uuid = require('uuid');
// const historyService = require('./historyService'); // Импортируем historyService
// //Топ версия
// class EmployeeController {
//     async createEmployee(req, res, next) {
//         try {
//             // Получаем данные сотрудника из запроса
//             const {
//                 last_name, first_name, middle_name, birth_date,
//                 passport, address
//             } = req.body;
//
//             // Создаем запись сотрудника
//             const employee = await Employees.create({
//                 last_name,
//                 first_name,
//                 middle_name,
//                 birth_date
//             });
//
//             // Создаем запись паспорта
//             let passportInstance = null;
//             if (passport) {
//                 passportInstance = await Passport.create({
//                     ...passport,
//                     employee_id: employee.id
//                 });
//             }
//
//             // Создаем запись адреса
//             let addressInstance = null;
//             if (address) {
//                 addressInstance = await Address.create({
//                     ...address,
//                     employee_id: employee.id
//                 });
//             }
//
//             /// Обрабатываем загрузку файлов
//             const uploadedFiles = [];
//             if (req.files && req.files.files) {
//                 // Преобразуем в массив, даже если это один файл
//                 const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
//
//                 for (const file of files) {
//                     try {
//                         // Проверяем расширение файла
//                         const fileExt = path.extname(file.name).toLowerCase();
//                         if (fileExt !== '.jpg' && fileExt !== '.jpeg') {
//                             console.log('Неподдерживаемый формат файла:', file.name);
//                             continue;
//                         }
//
//                         // Создаем уникальное имя файла
//                         const fileName = uuid.v4() + fileExt;
//                         const filePath = path.resolve(__dirname, '..', 'static', fileName);
//
//                         // Сохраняем файл
//                         await file.mv(filePath);
//
//                         // Создаем запись о файле в БД
//                         const fileRecord = await Files.create({
//                             name: file.name,
//                             file_url: fileName,
//                             employee_id: employee.id
//                         });
//
//                         uploadedFiles.push(fileRecord);
//                     } catch (fileError) {
//                         console.log('Ошибка при обработке файла', fileError);
//                     }
//                 }
//             }
//
//
//             // Получаем созданного сотрудника со всеми связанными данными
//             const createdEmployee = await Employees.findOne({
//                 where: { id: employee.id },
//                 include: [
//                     { model: Passport },
//                     { model: Address },
//                     { model: Files }
//                 ]
//             });
//
//             // Записываем в историю
//             await historyService.createHistoryEntry(
//                 'Сотрудник',
//                 employee.id,
//                 'create',
//                 {
//                     last_name: { old: null, new: last_name },
//                     first_name: { old: null, new: first_name },
//                     middle_name: { old: null, new: middle_name },
//                     birth_date: { old: null, new: birth_date },
//                     passport: passport ? { old: null, new: passport } : { old: null, new: null }, // Полные данные паспорта
//                     address: address ? { old: null, new: address } : { old: null, new: null }, // Полные данные адреса
//                     files: { old: null, new: uploadedFiles.map(f => f.name) }
//                 },
//                 null // Пока нет авторизации
//             );
//
//             return res.status(201).json(createdEmployee);
//         } catch (error) {
//             console.log('Ошибка при создании сотрудника', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async getAllEmployees(req, res, next) {
//         try {
//             let {page, limit} = req.query;
//             page = page || 1;
//             limit = limit || 10;
//             let offset = page * limit - limit;
//
//             const {count, rows} = await Employees.findAndCountAll({
//                 limit,
//                 offset,
//                 distinct: true,
//                 include: [
//                     { model: Passport },
//                     { model: Address },
//                     { model: Files }
//                 ]
//             })
//             return res.json({count, rows});
//             // const employees = await Employees.findAll({
//             //     include: [
//             //         { model: Passport },
//             //         { model: Address },
//             //         { model: Files }
//             //     ]
//             // });
//             // return res.json(employees);
//         } catch (error) {
//             console.log('Ошибка при получении всех сотрудников', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async getOneEmployee(req, res, next) {
//         const { id } = req.params;
//         try {
//             const employee = await Employees.findOne({
//                 where: { id },
//                 include: [
//                     { model: Passport },
//                     { model: Address },
//                     { model: Files }
//                 ]
//             });
//
//             if (!employee) {
//                 return res.status(404).json({ error: 'Сотрудник не найден' });
//             }
//
//             return res.json(employee);
//         } catch (error) {
//             console.log('Ошибка при получении сотрудника', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async updateEmployee(req, res, next) {
//         const { id } = req.params;
//         try {
//             const employee = await Employees.findOne({
//                 where: { id },
//                 include: [
//                     { model: Passport },
//                     { model: Address },
//                     { model: Files }
//                 ]
//             });
//
//             if (!employee) {
//                 return res.status(404).json({ error: 'Сотрудник не найден' });
//             }
//
//             // Сохраняем старые значения для истории
//             const oldLastName = employee.last_name;
//             const oldFirstName = employee.first_name;
//             const oldMiddleName = employee.middle_name;
//             const oldBirthDate = employee.birth_date;
//             const oldPassport = employee.passport ? { ...employee.passport.dataValues } : null; // Получаем все данные паспорта
//             const oldAddress = employee.address ? { ...employee.address.dataValues } : null; // Получаем все данные адреса
//             const oldFiles = employee.files.map(f => f.name);
//
//             // Обновляем данные сотрудника
//             const { last_name, first_name, middle_name, birth_date, passport, address } = req.body;
//
//             await employee.update({
//                 last_name: last_name || employee.last_name,
//                 first_name: first_name || employee.first_name,
//                 middle_name: middle_name || employee.middle_name,
//                 birth_date: birth_date || employee.birth_date
//             });
//
//             // Обновляем паспорт
//             if (passport && employee.passport) {
//                 await employee.passport.update(passport);
//             } else if (passport) {
//                 await Passport.create({
//                     ...passport,
//                     employee_id: employee.id
//                 });
//             }
//
//             // Обновляем адрес
//             if (address && employee.address) {
//                 await employee.address.update(address);
//             } else if (address) {
//                 await Address.create({
//                     ...address,
//                     employee_id: employee.id
//                 });
//             }
//
//             // Обрабатываем новые файлы
//             const uploadedFiles = [];
//             if (req.files) {
//                 const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
//
//                 for (const file of files) {
//                     // Проверяем расширение файла
//                     const fileExt = path.extname(file.name).toLowerCase();
//                     if (fileExt !== '.jpg' && fileExt !== '.jpeg' && fileExt !== '.png') {
//                         continue; // Пропускаем файлы не jpg формата
//                     }
//
//                     // Создаем уникальное имя файла
//                     const fileName = uuid.v4() + fileExt;
//                     const filePath = path.resolve(__dirname, '..', 'static', fileName);
//
//                     // Сохраняем файл
//                     await file.mv(filePath);
//
//                     // Создаем запись о файле в БД
//                     const fileRecord = await Files.create({
//                         name: file.name,
//                         file_url: fileName,
//                         employee_id: employee.id
//                     });
//                     uploadedFiles.push(fileRecord);
//                 }
//             }
//
//             // Получаем обновленного сотрудника
//             const updatedEmployee = await Employees.findOne({
//                 where: { id },
//                 include: [
//                     { model: Passport },
//                     { model: Address },
//                     { model: Files }
//                 ]
//             });
//
//             // Записываем в историю
//             await historyService.createHistoryEntry(
//                 'Сотрудник',
//                 id,
//                 'update',
//                 {
//                     last_name: { old: oldLastName, new: last_name || oldLastName },
//                     first_name: { old: oldFirstName, new: first_name || oldFirstName },
//                     middle_name: { old: oldMiddleName, new: middle_name || oldMiddleName },
//                     birth_date: { old: oldBirthDate, new: birth_date || oldBirthDate },
//                     passport: { old: oldPassport, new: passport ? passport : oldPassport }, // Все данные паспорта
//                     address: { old: oldAddress, new: address ? address : oldAddress }, // Все данные адреса
//                     files: { old: oldFiles, new: uploadedFiles.map(f => f.name) }
//                 },
//                 null // Пока нет авторизации
//             );
//
//             return res.json(updatedEmployee);
//         } catch (error) {
//             console.log('Ошибка при обновлении сотрудника', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async deleteEmployee(req, res, next) {
//         const { id } = req.params;
//         // Создаем транзакцию для обеспечения целостности данных
//         const transaction = await sequelize.transaction();
//
//         try {
//             // Находим сотрудника
//             const employee = await Employees.findOne({
//                 where: { id },
//                 include: [
//                     { model: Passport },
//                     { model: Address },
//                     { model: Files }
//                 ],
//                 transaction
//             });
//
//             if (!employee) {
//                 await transaction.rollback();
//                 return res.status(404).json({ error: 'Сотрудник не найден' });
//             }
//             // Сохраняем старые значения для истории
//             const oldLastName = employee.last_name;
//             const oldFirstName = employee.first_name;
//             const oldMiddleName = employee.middle_name;
//             const oldBirthDate = employee.birth_date;
//             const oldPassport = employee.passport ? { ...employee.passport.dataValues } : null;  // Получаем все данные
//             const oldAddress = employee.address ? { ...employee.address.dataValues } : null;    // Получаем все данные
//             const oldFiles = employee.files.map(f => f.name);
//
//             // Удаляем связанные записи (мягкое удаление)
//             // Паспорт
//             if (employee.passport) {
//                 await employee.passport.destroy({ transaction });
//             }
//
//             // Адрес
//             if (employee.address) {
//                 await employee.address.destroy({ transaction });
//             }
//
//             // Файлы
//             if (employee.files && employee.files.length > 0) {
//                 for (const file of employee.files) {
//                     await file.destroy({ transaction });
//                 }
//             }
//
//             // Удаляем самого сотрудника (мягкое удаление)
//             await employee.destroy({ transaction });
//
//             // Фиксируем транзакцию
//             await transaction.commit();
//             await historyService.createHistoryEntry(
//                 'Сотрудник',
//                 id,
//                 'delete',
//                 {
//                     last_name: { old: oldLastName, new: null },
//                     first_name: { old: oldFirstName, new: null },
//                     middle_name: { old: oldMiddleName, new: null },
//                     birth_date: { old: oldBirthDate, new: null },
//                     passport: { old: oldPassport, new: null }, // Все данные паспорта
//                     address: { old: oldAddress, new: null }, // Все данные адреса
//                     files: { old: oldFiles, new: null }
//                 },
//                 null // Пока нет авторизации
//             );
//
//             return res.json({
//                 message: 'Сотрудник и все связанные данные успешно удалены (мягкое удаление)',
//                 employeeId: id
//             });
//         } catch (error) {
//             // Откатываем транзакцию в случае ошибки
//             await transaction.rollback();
//             console.log('Ошибка при удалении сотрудника', error);
//             return res.status(500).json({
//                 error: 'Ошибка сервера',
//                 details: error.message
//             });
//         }
//     }
//
//     // УДАЛИТЬ ПОСЛЕ РАЗРАБОТКИ
//
//     async hardDeleteEmployee(req, res, next) {
//         const { id } = req.params;
//         try {
//             // Находим сотрудника, включая удаленные записи
//             const employee = await Employees.findOne({
//                 where: { id },
//                 include: [{ model: Files }],
//                 paranoid: false
//             });
//
//             if (!employee) {
//                 return res.status(404).json({ error: 'Сотрудник не найден' });
//             }
//
//             // Удаляем физические файлы с сервера
//             if (employee.files && employee.files.length > 0) {
//                 for (const file of employee.files) {
//                     const filePath = path.resolve(__dirname, '..', 'static', file.file_url);
//                     if (fs.existsSync(filePath)) {
//                         fs.unlinkSync(filePath);
//                     }
//                 }
//             }
//
//             // Полное удаление сотрудника и связанных записей из БД
//             await employee.destroy({ force: true });
//
//             return res.json({ message: 'Сотрудник и все связанные данные полностью удалены' });
//         } catch (error) {
//             console.log('Ошибка при полном удалении сотрудника', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async deleteFile(req, res, next) {
//         const { id } = req.params;
//         try {
//             const file = await Files.findByPk(id);
//
//             if (!file) {
//                 return res.status(404).json({ error: 'Файл не найден' });
//             }
//
//             // Мягкое удаление файла (физический файл остается на сервере)
//             await file.destroy();
//
//             return res.json({ message: 'Файл успешно удален (мягкое удаление)' });
//         } catch (error) {
//             console.log('Ошибка при удалении файла', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async hardDeleteFile(req, res, next) {
//         const { id } = req.params;
//         try {
//             // Находим файл, включая удаленные записи
//             const file = await Files.findByPk(id, { paranoid: false });
//
//             if (!file) {
//                 return res.status(404).json({ error: 'Файл не найден' });
//             }
//
//             // Удаляем физический файл с сервера
//             const filePath = path.resolve(__dirname, '..', 'static', file.file_url);
//             if (fs.existsSync(filePath)) {
//                 fs.unlinkSync(filePath);
//             }
//
//             // Полное удаление записи о файле из БД
//             await file.destroy({ force: true });
//
//             return res.json({ message: 'Файл полностью удален' });
//         } catch (error) {
//             console.log('Ошибка при полном удалении файла', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async restoreEmployee(req, res, next) {
//         const { id } = req.params;
//         try {
//             // Находим удаленного сотрудника
//             const employee = await Employees.findOne({
//                 where: { id },
//                 paranoid: false
//             });
//
//             if (!employee) {
//                 return res.status(404).json({ error: 'Сотрудник не найден' });
//             }
//
//             if (!employee.deletedAt) {
//                 return res.status(400).json({ error: 'Сотрудник не был удален' });
//             }
//
//             // Восстанавливаем сотрудника
//             await employee.restore();
//
//             // Восстанавливаем связанные записи
//             await Passport.restore({ where: { employee_id: id } });
//             await Address.restore({ where: { employee_id: id } });
//             await Files.restore({ where: { employee_id: id } });
//
//             // Получаем восстановленного сотрудника со всеми связанными данными
//             const restoredEmployee = await Employees.findOne({
//                 where: { id },
//                 include: [
//                     { model: Passport },
//                     { model: Address },
//                     { model: Files }
//                 ]
//             });
//             await historyService.createHistoryEntry(
//                 'Сотрудник',
//                 id,
//                 'restore',
//                 {
//                     last_name: { old: null, new: restoredEmployee.last_name },
//                     first_name: { old: null, new: restoredEmployee.first_name },
//                     middle_name: { old: null, new: restoredEmployee.middle_name },
//                     birth_date: { old: null, new: restoredEmployee.birth_date },
//                     passport: restoredEmployee.passport ? { old: null, new: { ...restoredEmployee.dataValues } } : { old: null, new: null }, // Все данные
//                     address: restoredEmployee.address ? { old: null, new: { ...restoredEmployee.dataValues } } : { old: null, new: null }, // Все данные
//                     files: { old: null, new: restoredEmployee.files.map(f => f.name) }
//                 },
//                 null // Пока нет авторизации
//             );
//
//             return res.json({
//                 message: 'Сотрудник и все связанные данные успешно восстановлены',
//                 employee: restoredEmployee
//             });
//         } catch (error) {
//             console.log('Ошибка при восстановлении сотрудника', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async restoreFile(req, res, next) {
//         const { id } = req.params;
//         try {
//             // Находим удаленный файл
//             const file = await Files.findOne({
//                 where: { id },
//                 paranoid: false
//             });
//
//             if (!file) {
//                 return res.status(404).json({ error: 'Файл не найден' });
//             }
//
//             if (!file.deletedAt) {
//                 return res.status(400).json({ error: 'Файл не был удален' });
//             }
//
//             // Восстанавливаем файл
//             await file.restore();
//
//             return res.json({
//                 message: 'Файл успешно восстановлен',
//                 file
//             });
//         } catch (error) {
//             console.log('Ошибка при восстановлении файла', error);
//             return res.status(500).json({ error: 'Ошибка сервера' });
//         }
//     }
//
//     async getEmployeeHistory(req, res, next) {
//         const { id } = req.params;
//         const { page, limit } = req.query;
//         try {
//             const { count, rows } = await historyService.getHistoryForObject('Сотрудник', id, page, limit);
//             return res.json({ count, rows });
//         } catch (error) {
//             console.error("Ошибка при получении истории сотрудника", error);
//             return next(error);
//         }
//     }
// }
//
// module.exports = new EmployeeController();

const Employees = require('../models/employees');
const Passport = require('../models/passport');
const Address = require('../models/address');
const Files = require('../models/file');
const path = require('path');
const sequelize = require('../db');
const fs = require('fs');
const uuid = require('uuid');
const historyService = require('./historyService'); // Импортируем historyService

//Топ версия
class EmployeeController {
    // Добавляем новый метод для загрузки файлов
    async uploadEmployeeFiles(req, res, next) {
        try {
            const employeeId = req.params.id;

            // Проверяем, существует ли сотрудник
            const employee = await Employees.findByPk(employeeId);
            if (!employee) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }

            // Обрабатываем загрузку файлов
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
                            employee_id: employeeId
                        });

                        uploadedFiles.push(fileRecord);
                    } catch (fileError) {
                        console.log('Ошибка при обработке файла', fileError);
                    }
                }
            }

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник',
                employeeId,
                'update',
                {
                    files: { old: null, new: uploadedFiles.map(f => f.name) }
                },
                null // Пока нет авторизации
            );

            return res.status(200).json({
                success: true,
                files: uploadedFiles
            });
        } catch (error) {
            console.log('Ошибка при загрузке файлов', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

// Изменяем метод createEmployee, убирая из него обработку файлов
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
            let passportInstance = null;
            if (passport) {
                passportInstance = await Passport.create({
                    ...passport,
                    employee_id: employee.id
                });
            }

            // Создаем запись адреса
            let addressInstance = null;
            if (address) {
                addressInstance = await Address.create({
                    ...address,
                    employee_id: employee.id
                });
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

            // Записываем в историю
            await historyService.createHistoryEntry(
                'Сотрудник',
                employee.id,
                'create',
                {
                    last_name: { old: null, new: last_name },
                    first_name: { old: null, new: first_name },
                    middle_name: { old: null, new: middle_name },
                    birth_date: { old: null, new: birth_date },
                    passport: passport ? { old: null, new: passport } : { old: null, new: null },
                    address: address ? { old: null, new: address } : { old: null, new: null }
                },
                null // Пока нет авторизации
            );

            return res.status(201).json(createdEmployee);
        } catch (error) {
            console.log('Ошибка при создании сотрудника', error);
            return res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async getAllEmployees(req, res, next) {
        try {
            let { page, limit } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            const { count, rows } = await Employees.findAndCountAll({
                limit,
                offset,
                distinct: true,
                order: [['id', 'DESC']], // Сортировка по id
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            })
            return res.json({ count, rows });
            // const employees = await Employees.findAll({
            //     include: [
            //         { model: Passport },
            //         { model: Address },
            //         { model: Files }
            //     ]
            // });
            // return res.json(employees);
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

            // Сохраняем старые значения для истории
            const oldLastName = employee.last_name;
            const oldFirstName = employee.first_name;
            const oldMiddleName = employee.middle_name;
            const oldBirthDate = employee.birth_date;
            const oldPassport = employee.passport ? employee.passport.get({ plain: true }) : null; // Получаем все данные паспорта
            const oldAddress = employee.address ? { ...employee.address.dataValues } : null; // Получаем все данные адреса
            const oldFiles = employee.files.map(f => ({ name: f.name, file_url: f.file_url })); // Сохраняем URL

            // Обновляем данные сотрудника
            const { last_name, first_name, middle_name, birth_date, passport, address } = req.body;

            await employee.update({
                last_name: last_name || employee.last_name,
                first_name: first_name || employee.first_name,
                middle_name: middle_name || employee.middle_name,
                birth_date: birth_date || employee.birth_date
            });

            // Обновляем паспорт
            let updatedPassport = null;
            if (passport && employee.passport) {
                await employee.passport.update(passport);
                updatedPassport = employee.passport.get({ plain: true });
            } else if (passport) {
                const newPassport = await Passport.create({
                    ...passport,
                    employee_id: employee.id
                });
                updatedPassport = { ...newPassport.dataValues };
            } else {
                updatedPassport = oldPassport;
            }

            // Обновляем адрес
            let updatedAddress = null;
            if (address && employee.address) {
                await employee.address.update(address);
                updatedAddress = { ...employee.address.dataValues };
            } else if (address) {
                const newAddress = await Address.create({
                    ...address,
                    employee_id: employee.id
                });
                updatedAddress = { ...newAddress.dataValues };
            } else {
                updatedAddress = oldAddress;
            }

            // Обрабатываем новые файлы
            const uploadedFiles = [];
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
                    const fileRecord = await Files.create({
                        name: file.name,
                        file_url: fileName,
                        employee_id: employee.id
                    });
                    uploadedFiles.push(fileRecord);
                }
            }
            const newFiles = uploadedFiles.map(f => ({ name: f.name, file_url: f.file_url }));
            // Получаем обновленного сотрудника
            const updatedEmployee = await Employees.findOne({
                where: { id },
                include: [
                    { model: Passport },
                    { model: Address },
                    { model: Files }
                ]
            });

            // Подготавливаем данные для истории
            const historyData = {
                last_name: { old: oldLastName, new: last_name || oldLastName },
                first_name: { old: oldFirstName, new: first_name || oldFirstName },
                middle_name: { old: oldMiddleName, new: middle_name || oldMiddleName },
                birth_date: { old: oldBirthDate, new: birth_date || oldBirthDate },
                passport: { old: oldPassport, new: updatedPassport }, // Сравниваем старые и новые данные паспорта
                address: { old: oldAddress, new: updatedAddress },   // Сравниваем старые и новые данные адреса
                files: {
                    old: oldFiles,
                    new: updatedEmployee.files.map(f => ({ name: f.name, file_url: f.file_url }))
                }
            };

            // Фильтруем изменения для истории
            const changedFields = {};
            for (const key in historyData) {
                if (key === 'files') {
                    const oldFilesName = historyData[key].old.map(f => f.name);
                    const newFilesName = historyData[key].new.map(f => f.name);
                    if (JSON.stringify(oldFilesName) !== JSON.stringify(newFilesName)) {
                        changedFields[key] = { old: historyData[key].old, new: historyData[key].new };
                    }
                }
                else if (key === 'passport' || key === 'address') {
                    if (historyData[key].old === null && historyData[key].new !== null) {
                        changedFields[key] = {old: null, new: historyData[key].new}
                    }
                    else if (historyData[key].old !== null && historyData[key].new === null) {
                        changedFields[key] = {old: historyData[key].old, new: null}
                    }
                    else if (historyData[key].old && historyData[key].new) {
                        let hasChanged = false;
                        for (const prop in historyData[key].old) {
                            if (historyData[key].old[prop] !== historyData[key].new[prop]) {
                                hasChanged = true;
                                break;
                            }
                        }
                        if (hasChanged) {
                            changedFields[key] = { old: historyData[key].old, new: historyData[key].new };
                        }
                    }
                }
                else if (historyData[key].old !== historyData[key].new) {
                    changedFields[key] = { old: historyData[key].old, new: historyData[key].new };
                }
            }

            // Записываем в историю только измененные поля
            if (Object.keys(changedFields).length > 0) {
                await historyService.createHistoryEntry(
                    'Сотрудник',
                    id,
                    'update',
                    changedFields,
                    null // Пока нет авторизации
                );
            }

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
            // Сохраняем старые значения для истории
            const oldLastName = employee.last_name;
            const oldFirstName = employee.first_name;
            const oldMiddleName = employee.middle_name;
            const oldBirthDate = employee.birth_date;
            const oldPassport = employee.passport ? { ...employee.passport.dataValues } : null;  // Получаем все данные
            const oldAddress = employee.address ? { ...employee.address.dataValues } : null;    // Получаем все данные
            const oldFiles = employee.files.map(f => f.name);

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
            await historyService.createHistoryEntry(
                'Сотрудник',
                id,
                'delete',
                {
                    last_name: { old: oldLastName, new: null },
                    first_name: { old: oldFirstName, new: null },
                    middle_name: { old: oldMiddleName, new: null },
                    birth_date: { old: oldBirthDate, new: null },
                    passport: { old: oldPassport, new: null }, // Все данные паспорта
                    address: { old: oldAddress, new: null }, // Все данные адреса
                    files: { old: oldFiles, new: null }
                },
                null // Пока нет авторизации
            );

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
            await historyService.createHistoryEntry(
                'Сотрудник',
                id,
                'restore',
                {
                    last_name: { old: null, new: restoredEmployee.last_name },
                    first_name: { old: null, new: restoredEmployee.first_name },
                    middle_name: { old: null, new: restoredEmployee.middle_name },
                    birth_date: { old: null, new: restoredEmployee.birth_date },
                    passport: restoredEmployee.passport ? { old: null, new: { ...restoredEmployee.dataValues } } : { old: null, new: null }, // Все данные
                    address: restoredEmployee.address ? { old: null, new: { ...restoredEmployee.dataValues } } : { old: null, new: null }, // Все данные
                    files: { old: null, new: restoredEmployee.files.map(f => f.name) }
                },
                null // Пока нет авторизации
            );

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

    async getEmployeeHistory(req, res, next) {
        const { employee_id } = req.params;
        const { page, limit } = req.query;
        try {
            const { count, rows } = await historyService.getHistoryForObject('Сотрудник', employee_id, page, limit);
            return res.json({ count, rows });
        } catch (error) {
            console.error("Ошибка при получении истории сотрудника", error);
            return next(error);
        }
    }
}

module.exports = new EmployeeController();

