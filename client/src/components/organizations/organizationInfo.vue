<template>
  <div class="organization-page">
    <h1>{{ organization.name }}</h1>
    <p v-if="organization.comment">{{ organization.comment }}</p>

    <div class="departments-section">
      <h2>Отделы</h2>
      <organizationDepartmentTree
          :departments="departments"
          @departmentUpdated="loadOrganization"
      />
    </div>

    <router-link to="/organization">
      Вернуться к списку организаций
    </router-link>
  </div>

  <MyModalWindow v-model:show="dialogVisible">
    <DepartmentCreateForm
        :cancel="cancelCreate"
        :organizationId="organization.id"
        :departments="departments"
        @created="loadOrganization"
    />
  </MyModalWindow>

  <button @click="showDialog">
    Создать отдел
  </button>
</template>

<script>
import organizationDepartmentTree from "@/components/organizations/organizationDepartmentTree.vue";
import {fetchOrganizationWithDepartments} from "@/http/organizationAPI.js";
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import DepartmentCreateForm from "@/components/departments/departmentCreateForm.vue";


export default {
  components: {DepartmentCreateForm, MyModalWindow, organizationDepartmentTree},
  data() {
    return {
      organization: {},
      departments: [],
      dialogVisible: false
    };
  },
  async created() {
    await this.loadOrganization();
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    cancelCreate() {
      this.dialogVisible = false;
    },

    async loadOrganization() {
      try {
        const organizationId = this.$route.params.id;
        const data = await fetchOrganizationWithDepartments(organizationId);
        this.organization = data;
        this.departments = data.departments || [];
        this.dialogVisible = false;
      } catch (error) {
        console.error('Ошибка при загрузке организации:', error);
      }
    },
  },
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