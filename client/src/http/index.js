import axios from 'axios';

const $host = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true // Добавлено для работы с куками
});

const $authHost = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Автоматическая подстановка токена
const authInterception = (config) => {
  config.withCredentials = true;
  return config;
};

// Обработчик ошибки 401, она не высвечивает ошибку на сайте, а перенаправляет на страницу авторизации
$host.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

$authHost.interceptors.request.use(authInterception);

// $authHost.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export { $host, $authHost };
