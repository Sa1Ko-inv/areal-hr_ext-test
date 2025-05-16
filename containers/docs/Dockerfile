## Стадия 1: Сборка VitePress
#FROM node:22.15.0-alpine as builder
#
#WORKDIR /app
#
## Установить git
#RUN apk add --no-cache git
#
## Копируем файлы package.json и package-lock.json
#COPY package.json ./
#
## Устанавливаем зависимости
#RUN npm install
#
## Копируем весь проект
#COPY docs ./docs
#
## Собираем статические файлы VitePress
#RUN npm run docs:build
#
## Стадия 2: Запуск Nginx
#FROM nginx:stable-alpine as production-stage
#
#EXPOSE 80
#
#RUN mkdir /app
#
#COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html
#
#
#CMD [ "nginx", "-g", "daemon off;" ]

# Стадия сборки
FROM node:22.15.0-alpine as builder

WORKDIR /app

# Устанавливаем зависимости (включая git для возможных VitePress плагинов)
RUN apk add --no-cache git

# Копируем только файлы, необходимые для установки зависимостей
COPY package.json ./
RUN npm install

# Копируем документацию и конфиги
COPY docs ./docs

# Собираем документацию
RUN npm run docs:build

# Стадия запуска
FROM nginx:stable-alpine

# Копируем собранные файлы документации
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html/docs

# Копируем конфиг Nginx
COPY docs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]