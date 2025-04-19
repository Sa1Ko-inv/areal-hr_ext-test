import { defineStore } from "pinia";

export const UserStore = defineStore("user", {
  state: () => ({
    isAuth: localStorage.getItem('isAuth') || false, // Состояние авторизации
    user:localStorage.getItem('user') || {}, // Данные пользователя
    role: localStorage.getItem('role') || null, // Роль пользователя
    isLoading: false,
  }),
  actions: {
    // Установка состояния авторизации
    setIsAuth(bool) {
      this.isAuth = bool;
      localStorage.setItem("isAuth", bool);
    },
    // Установка данных пользователя
    setUser(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    // Установка роли пользователя
    setRole(role) {
      this.role = role;
      localStorage.setItem("role", role);
    },
    // Проверка роли: администратор
    isAdmin() {
      return this.role === "admin";
    },
    // Проверка роли: менеджер HR
    isHRManager() {
      return this.role === "hr_manager";
    },
    // Выход из системы
    logout() {
      this.isAuth = false;
      this.user = null;
      this.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem('isAuth');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    setIsLoading(loading) {
      this.isLoading = loading;
    }
  },
});