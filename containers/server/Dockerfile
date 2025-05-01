FROM node:20.18.0
WORKDIR /app

# Копируем файлы приложения
COPY ./server .

# Копируем entrypoint скрипт
COPY ./containers/server/entrypoint.sh /entrypoint.sh

# Устанавливаем зависимости
RUN npm install

# Делаем entrypoint скрипт исполняемым
RUN chmod +x /entrypoint.sh

EXPOSE 5000

# Устанавливаем entrypoint
ENTRYPOINT ["/entrypoint.sh"]

# Команда по умолчанию
CMD ["node", "src/index.js"]