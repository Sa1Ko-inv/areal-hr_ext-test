# Обзор API

Areal-hr_ext-test предоставляет RESTful API для интеграции с другими системами.

## Базовый URL

localhost:5000/api

Данный URL используется для всех запросов к API.

## API Эндпойнты

### Отделы

| Метод   | Путь                              | Описание                                  |
|---------|-----------------------------------|-------------------------------------------|
| POST    | `/api/department`                 | Создание нового отдела                    |
| GET     | `/api/department`                 | Получение списка всех отделов             |
| GET     | `/api/department/:id/history`     | Получение истории изменений отдела        |
| GET     | `/api/department/delete`          | Получение списка удаленных отделов        |
| PUT     | `/api/department/:id`             | Обновление данных отдела                  |
| DELETE  | `/api/department/:id`             | Удаление отдела                           |

### Сотрудники

| Метод   | Путь                                  | Описание                                  |
|---------|---------------------------------------|-------------------------------------------|
| POST    | `/api/employee`                       | Создание нового сотрудника                |
| POST    | `/api/employee/:id/files`             | Загрузка файлов для сотрудника            |
| PUT     | `/api/employee/:id`                   | Обновление данных сотрудника              |
| GET     | `/api/employee`                       | Получение списка всех сотрудников         |
| GET     | `/api/employee/:id`                   | Получение информации о сотруднике         |
| GET     | `/api/employee/:employee_id/history`  | Получение истории изменений сотрудника    |
| DELETE  | `/api/employee/file/hard/:id`         | Жесткое удаление файла сотрудника         |

### HR-операции

| Метод   | Путь                                  | Описание                                  |
|---------|---------------------------------------|-------------------------------------------|
| POST    | `/api/hr/hire`                        | Прием сотрудника на работу                |
| PUT     | `/api/hr/salary/:employee_id`         | Изменение зарплаты сотрудника             |
| PUT     | `/api/hr/department/:employee_id`     | Перевод сотрудника в другой отдел         |
| POST    | `/api/hr/fire/:employee_id`           | Увольнение сотрудника                     |
| GET     | `/api/hr`                             | Получение всех HR-операций                |
| GET     | `/api/hr/fired-employees`             | Получение истории уволенных сотрудников   |
| GET     | `/api/hr/employee/:employee_id`       | Получение HR-информации о сотруднике      |

### Организации

| Метод   | Путь                                  | Описание                                  |
|---------|---------------------------------------|-------------------------------------------|
| POST    | `/api/organization`                   | Создание новой организации                |
| GET     | `/api/organization`                   | Получение списка всех организаций         |
| GET     | `/api/organization/:id/departments`   | Получение организации с ее отделами       |
| GET     | `/api/organization/:id/history`       | Получение истории изменений организации   |
| GET     | `/api/organization/delete`            | Получение списка удаленных организаций    |
| PUT     | `/api/organization/:id`               | Обновление данных организации             |
| DELETE  | `/api/organization/:id`               | Удаление организации                      |

### Должности

| Метод   | Путь                              | Описание                                  |
|---------|-----------------------------------|-------------------------------------------|
| POST    | `/api/position`                   | Создание новой должности                  |
| GET     | `/api/position`                   | Получение списка всех должностей          |
| GET     | `/api/position/:id/history`       | Получение истории изменений должности     |
| GET     | `/api/position/delete`            | Получение списка удаленных должностей     |
| PUT     | `/api/position/:id`               | Обновление данных должности               |
| DELETE  | `/api/position/:id`               | Удаление должности                        |

### Пользователи

| Метод   | Путь                              | Описание                                  |                               
|---------|-----------------------------------|-------------------------------------------|
| POST    | `/api/user/registration`          | Регистрация нового пользователя           |
| POST    | `/api/user/login`                 | Авторизация пользователя                  |
| POST    | `/api/user/logout`                | Выход пользователя из системы             |
| GET     | `/api/user/auth`                  | Проверка авторизации пользователя         |
| POST    | `/api/user/create`                | Создание нового пользователя (админ)      |
| GET     | `/api/user`                       | Получение списка всех пользователей       |
| PUT     | `/api/user/:id`                   | Обновление данных пользователя            |
| GET     | `/api/user/:userId/history`       | Получение истории изменений пользователя  |
| GET     | `/api/user/delete`                | Получение списка удаленных пользователей  |
| DELETE  | `/api/user/:id`                   | Удаление пользователя                     |                           |

### Коды ответов

| Код     | Описание                              |
|---------|---------------------------------------|
| 200     | Успешное выполнение запроса           |
| 201     | Ресурс успешно создан                 |
| 400     | Некорректный запрос                   |
| 401     | Ошибка аутентификации                 |
| 403     | Доступ запрещен                       |
| 404     | Ресурс не найден                      |
| 500     | Внутренняя ошибка сервера             |

## Коды ответов

| Код     | Описание                              |
|---------|---------------------------------------|
| 200     | Успешное выполнение запроса           |
| 201     | Ресурс успешно создан                 |
| 400     | Некорректный запрос                   |
| 401     | Ошибка аутентификации                 |
| 403     | Доступ запрещен                       |
| 404     | Ресурс не найден                      |
| 500     | Внутренняя ошибка сервера             |