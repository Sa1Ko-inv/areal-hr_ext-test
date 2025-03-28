<template>
  <div class="organization-page">
    <h1>{{ organization.name }}</h1>
    <p v-if="organization.comment">{{ organization.comment }}</p>

    <div class="departments-section">
      <h2>Отделы</h2>
      <organizationDepartmentTree :departments="departments" />
    </div>

    <router-link to="/organization">
      Вернуться к списку организаций
    </router-link>
  </div>
</template>

<script>
import organizationDepartmentTree from "@/components/organizations/organizationDepartmentTree.vue";
import { fetchOrganizationWithDepartments } from "@/http/organizationAPI.js";


export default {
  components: { organizationDepartmentTree },
  data() {
    return {
      organization: {},
      departments: []
    };
  },
  async created() {
    await this.loadOrganization();
  },
  methods: {
    ORGANIZATION_ROUTE() {
      return ORGANIZATION_ROUTE
    },
    async loadOrganization() {
      try {
        const organizationId = this.$route.params.id;
        const data = await fetchOrganizationWithDepartments(organizationId);
        this.organization = data;
        this.departments = data.departments || [];
      } catch (error) {
        console.error('Ошибка при загрузке организации:', error);
      }
    }
  }
};
</script>

<style scoped>
.organization-page {
  padding: 20px;
}

.departments-section {
  margin-top: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
}
</style>