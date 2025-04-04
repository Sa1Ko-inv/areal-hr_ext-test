import {MAIN_ROUTE, ORGANIZATION_ROUTE, POSITION_ROUTE} from "@/utils/consts";
import {createRouter, createWebHistory} from "vue-router";
import position from "@/pages/position.vue";
import Employee from "@/pages/employee.vue";
import organization from "@/pages/organization.vue";
import organizationInfo from "@/components/organizations/organizationInfo.vue";

const routes = [
    {
        path: POSITION_ROUTE,
        name: 'position',
        component: position
    },

    {
        path: MAIN_ROUTE,
        component: Employee
    },

    {
        path: ORGANIZATION_ROUTE,
        component: organization
    },

    {
        path: '/organization/:id',
        name: 'Organization',
        component: organizationInfo
    }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router;