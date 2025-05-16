# Быстрый старт

Это руководство поможет вам быстро настроить и запустить проект Areal Practica.

## Предварительные требования

Для запуска проекта вам потребуется:

- Node.js (версия 16 или выше)
- PostgreSQL (версия 13 или выше)
- Docker и Docker Compose (опционально, для контейнеризации)

## Установка и запуск (без Docker)

### 1. Клонирование репозитория

```bash
git clone https://github.com/Sa1Ko-inv/areal-hr_ext-test
cd areal-hr_ext-test
```
### 2. Настройка сервера

Перейдите в директорию сервера и установите зависимости:

```bash
cd server
npm install
```

# Создайте файл .env со следующим содержимым:
```bash
PORT=5000 # Порт сервера на котором будет запущен сервер 
DB_NAME=db_name # Имя базы данных в PostgreSQL
DB_USER=db_user # Имя пользователя PostgreSQL
DB_PASSWORD=db_password # Пароль пользователя PostgreSQL
DB_HOST=localhost # Хост PostgreSQL
DB_PORT=db_port # Порт PostgreSQL
SECRET_KEY=your_secret_key # Секретный ключ для JWT
LOGIN=admin # Логин для создания тестового администратора
PASSWORD=admin # Пароль для создания тестового администратора
```
# Запуск сервера
```bash
npm run dev
```

### 3. Настройка клиента
Перейдите в директорию клиента и установите зависимости:

```bash
cd ../client
npm install
```
# Создайте файл .env со следующим содержимым:
```bash
VITE_API_URL=http://localhost:5000 # URL сервера
```
# Запуск клиента
```bash
npm run dev
```

## Установка и запуск (с Docker)

## 1. Создайте файл .env в корне проекта:

```bash
PORT=5000 # Порт сервера на котором будет запущен сервер 
DB_NAME=db_name # Имя базы данных в PostgreSQL
DB_USER=db_user # Имя пользователя PostgreSQL
DB_PASSWORD=db_password # Пароль пользователя PostgreSQL
DB_HOST=db 
DB_PORT=db_port # Порт PostgreSQL
SECRET_KEY=your_secret_key # Секретный ключ для JWT
LOGIN=admin # Логин для создания тестового администратора
PASSWORD=admin # Пароль для создания тестового администратора
```

## 2. Запустите Docker Compose

```bash
docker-compose up --build
```