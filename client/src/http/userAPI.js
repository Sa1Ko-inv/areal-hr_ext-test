//Реализация функций регистрации и авторизации и проверка токена на валидность
import {$authHost, $host} from "@/http/index";
import {jwtDecode} from "jwt-decode";

export const registration = async (login, password, first_name, last_name, middle_name, role) => {
    const {data} = await $host.post('api/user/registration', {login, password, first_name, last_name, middle_name, role});
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token);
}

export const login = async (login, password) => {
    const {data} = await $host.post('api/user/login', {login, password});
    console.log(data)
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token);
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth',);
    localStorage.setItem('token', data.token)
    const decoded = jwtDecode(data.token);
    console.log(data);
    localStorage.setItem('role', decoded.role);
    return jwtDecode(data.token);
}
