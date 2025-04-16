import { defineStore } from "pinia";

export const UserStore = defineStore("user", {
  state: () => ({
    isAuth: false, // Состояние авторизации
    user: {}, // Данные пользователя
    role: null, // Роль пользователя
  }),
  actions: {
    // Установка состояния авторизации
    setIsAuth(bool) {
      this.isAuth = bool;
    },
    // Установка данных пользователя
    setUser(user) {
      this.user = user;
    },
    // Установка роли пользователя
    setRole(role) {
      this.role = role;
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
    },
  },
});