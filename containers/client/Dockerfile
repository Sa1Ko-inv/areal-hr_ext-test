FROM node:22.15.0-alpine as build

WORKDIR /app

# Копируем package.json и package-lock.json из /client
COPY ./client/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем файлы приложения
COPY ./client .

RUN npm run build

FROM nginx:stable-alpine as production-stage

EXPOSE 3000

RUN mkdir /app

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf


CMD [ "nginx", "-g", "daemon off;" ]
