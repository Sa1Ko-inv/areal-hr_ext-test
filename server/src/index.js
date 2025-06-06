require('dotenv').config({ path: '../.env' });
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const PORT = process.env.PORT;
const app = express();
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Проверка папки статики и если ее нет, то создаем
const staticDir = path.resolve(__dirname, 'static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
  console.log(`Создана папка статики: ${staticDir}`);
}

const allowedOrigin = [
  'http://localhost',
  'http://localhost:3000',
  'http://client:3000',
  'https://areal-hr-ext-test.ru',
  'http://areal-hr-ext-test.ru',
  'http://areal-hr-ext-test.online',
]

// cors нужен чтобы наше приложение могло отправлять запросы на другой домен
app.use(cors({
  origin: allowedOrigin, // Указываем домен, с которого будут приходить запросы
  credentials: true
}));
// Чтобы наше приложение могло парсить json
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(
  fileUpload({
    limits: { fileSize: 20 * 1024 * 1024 }, // Ограничение размера файла (10MB)
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);
app.use(express.static(staticDir));

// Подключаем роутер, первый параметр - это префикс, по которому будет доступен наш роутер
app.use('/api', router);

// Обработка ошибок, последний middleware
app.use(errorHandler);

// Все операции с БД являются асинхронными
const start = async () => {
  try {
    // Подключение к БД
    await sequelize.authenticate();
    // await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
