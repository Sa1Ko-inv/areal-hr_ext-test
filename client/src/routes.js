import {MAIN_ROUTE, ORGANIZATION_ROUTE, POSITION_ROUTE} from "@/utils/consts";
import {createRouter, createWebHistory} from "vue-router";
import position from "@/pages/position.vue";
import main from "@/pages/main.vue";
import organization from "@/pages/organization.vue";

const routes = [
    {
        path: POSITION_ROUTE,
        name: 'position',
        component: position
    },

    {
        path: MAIN_ROUTE,
        component: main
    },

    {
        path: ORGANIZATION_ROUTE,
        component: organization
    }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router;