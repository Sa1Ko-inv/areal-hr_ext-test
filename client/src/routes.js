import { LOGIN_ROUTE, MAIN_ROUTE, ORGANIZATION_ROUTE, POSITION_ROUTE, USER_ROUTER } from '@/utils/consts';
import { createRouter, createWebHistory } from 'vue-router';
import positionPage from '@/pages/positionPage.vue';
import employeePage from '@/pages/employeePage.vue';
import organizationPage from '@/pages/organizationPage.vue';
import organizationInfo from '@/components/organizations/organizationInfo.vue';
import loginPage from "@/pages/loginPage.vue";
import userPage from '@/pages/userPage.vue';
import { UserStore } from '@/store/UserStore.js';

const routes = [
  {
    path: POSITION_ROUTE,
    name: 'Position',
    component: positionPage,
  },

  {
    path: MAIN_ROUTE,
    name: 'Main',
    component: employeePage,
    meta: { requiresAuth: true }
  },

  {
    path: ORGANIZATION_ROUTE,
    name: 'Organization',
    component: organizationPage,
    meta: { requiresAuth: true }
  },

  {
    path: '/organization/:id',
    name: 'OrganizationInfo',
    component: organizationInfo,
    meta: { requiresAuth: true }
  },

  {
    path: LOGIN_ROUTE,
    name: 'Login',
    component: loginPage,
  },
  {
    path: USER_ROUTER,
    name: 'User',
    component: userPage,
    meta: { requiresAuth: true } // Добавляем мета-поле для защиты маршрута
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = UserStore();

  console.log('--- Навигационный guard ---');
  console.log('Маршрут (to):', to.name, to.path);
  console.log('Пользователь авторизован:', userStore.isAuth);
  console.log('Роль пользователя:', userStore.role);
  console.log('isHRManager():', userStore.isHRManager());

  if (to.meta.requiresAuth && !userStore.isAuth) {
    console.log('[1] Требуется авторизация, но пользователь не авторизован → на логин');
    next(LOGIN_ROUTE);
    return;
  }

  if ((to.path === USER_ROUTER) && userStore.isHRManager()) {
    console.log('[2] Пользователь hr_manager пытается зайти на /user → на главную');
    next(MAIN_ROUTE);
    return;
  }

  console.log('[3] Разрешено');
  next();
});

export default router;
