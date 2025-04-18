//Реализация функций регистрации и авторизации и проверка токена на валидность
import { $authHost, $host } from '@/http/index';
import { jwtDecode } from 'jwt-decode';

export const registration = async (login, password, first_name, last_name, middle_name, role) => {
  const { data } = await $host.post('api/user/registration', {
    login,
    password,
    first_name,
    last_name,
    middle_name,
    role,
  });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const login = async (login, password) => {
  const { data } = await $host.post('api/user/login', { login, password });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

// Получение пользователей
export const fetchUsers = async (page = 1, limit = 10, searchQuery = '') => {
  const params = {
    page: page,
    limit: limit,
  };
  if (searchQuery) {
    params.search = searchQuery;
  }

  const response = await $host.get('api/user', { params });
  return response;
};

//Создание пользователя
export const createUser = async (last_name, first_name, middle_name, login, password, role) => {
  const { data } = await $authHost.post('api/user/create', {
    last_name,
    first_name,
    middle_name,
    login,
    password,
    role,
  });
  return data;
};

// Редактирование пользователя
export const updateUser = async (userId, userData) => {
  const response = await $authHost.put(`api/user/${userId}`, userData);
  console.log('Пользователь обновлен с данными:', userData);
  return response.data;
};