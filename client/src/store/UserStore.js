import { defineStore } from "pinia";
import { check, logout } from '@/http/userAPI.js';

export const UserStore = defineStore("user", {
  state: () => ({
    isAuth: false,
    user: {},
    role: null,
    isLoading: false,
    initialized: false // Добавляем флаг инициализации
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
    async initialize() {
      if (this.initialized) return;

      try {
        this.setIsLoading(true);
        const user = await check();
        this.setUser(user);
        this.setIsAuth(true);
        this.setRole(user.role);
      } catch (error) {
        this.setIsAuth(false);
        console.error('Ошибка при проверке авторизации:', error);
      } finally {
        this.setIsLoading(false);
        this.initialized = true;
      }
    },
    // Выход из системы
    async logout() {
      try {
        await logout();
        this.isAuth = false;
        this.user = {};
        this.role = null;
      } catch (error) {
        console.error('Ошибка при выходе:', error);
      }
    },
    setIsLoading(loading) {
      this.isLoading = loading;
    }
  },
});