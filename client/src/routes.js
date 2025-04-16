import { MAIN_ROUTE, ORGANIZATION_ROUTE, POSITION_ROUTE } from '@/utils/consts';
import { createRouter, createWebHistory } from 'vue-router';
import positionPage from '@/pages/positionPage.vue';
import employeePage from '@/pages/employeePage.vue';
import organizationPage from '@/pages/organizationPage.vue';
import organizationInfo from '@/components/organizations/organizationInfo.vue';

const routes = [
  {
    path: POSITION_ROUTE,
    name: 'position',
    component: positionPage,
  },

  {
    path: MAIN_ROUTE,
    component: employeePage,
  },

  {
    path: ORGANIZATION_ROUTE,
    component: organizationPage,
  },

  {
    path: '/organization/:id',
    name: 'Organization',
    component: organizationInfo,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
