FROM node:22.15.0-alpine
WORKDIR /app

# Копируем package.json и package-lock.json из /server
COPY server/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем файлы приложения
COPY ./server .

# Копируем entrypoint скрипт
COPY ./containers/server/entrypoint.sh /entrypoint.sh

# Устанавливаем зависимости
#RUN npm install

# Делаем entrypoint скрипт исполняемым
RUN chmod +x /entrypoint.sh

EXPOSE 5000

# Устанавливаем entrypoint
ENTRYPOINT ["sh", "/entrypoint.sh"]

# Команда по умолчанию
CMD ["node", "src/index.js"]