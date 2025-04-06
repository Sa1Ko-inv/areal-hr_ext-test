require('dotenv').config({path: '../.env'});
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const path = require('path');
// const errorHandler = require('./middleware/ErrorHandlingMiddleware');



const PORT = process.env.PORT || 7000;
const app = express();
// cors нужен чтобы наше приложение могло отправлять запросы на другой домен
app.use(cors());
// Чтобы наше приложение могло парсить json
app.use(express.json());

app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // Ограничение размера файла (10MB)
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(express.static(path.resolve(__dirname, 'static')));
// Подключаем роутер, первый параметр - это префикс, по которому будет доступен наш роутер
app.use('/api', router);

// Обработка ошибок, последний middleware
// app.use(errorHandler);

// Все операции с БД являются асинхронными
const start = async () => {
    try {
        // Подключение к БД
        await sequelize.authenticate();
        // await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        });
    } catch (e) {
        console.log(e);
    }
}

start()