<template>
  <div class="organization-info">
    <h1>{{ organization.name }}</h1>
    <p v-if="organization.comment">{{ organization.comment }}</p>

    <button @click="showDialog">
      Создать отдел
    </button>

    <div class="departments-section">
      <h2>Отделы</h2>

      <organizationDepartmentTree
          :departments="departments"
          @departmentUpdated="loadOrganization"
      />
    </div>

    <router-link to="/organization">
      <button>
        Вернуться к списку организаций
      </button>

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

<style lang="scss" scoped>
.organization-info {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    color: #792ec9;
    margin-bottom: 10px;
    font-size: 2rem;
  }

  p {
    color: #555;
    margin-bottom: 25px;
    font-size: 1rem;
    line-height: 1.5;
  }

  .departments-section {
    margin: 30px 0;

    h2 {
      color: #792ec9;
      font-size: 1.5rem;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid rgba(121, 46, 201, 0.2);
    }
  }

  a {
    display: inline-block;
    color: #792ec9;
    text-decoration: none;
    font-weight: 500;
    margin-top: 20px;
    transition: color 0.2s;

    &:hover {
      color: darken(#792ec9, 15%);
      text-decoration: underline;
    }
  }

  button {
    display: inline-block;
    margin-top: 15px;
    padding: 10px 20px;
    background-color: #792ec9;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: darken(#792ec9, 10%);
    }
  }
}
</style>