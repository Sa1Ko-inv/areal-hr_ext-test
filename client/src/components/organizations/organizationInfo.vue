<template>
  <div class="organization-info">
    <h1>{{ organization.name }}</h1>
    <p v-if="organization.comment">{{ organization.comment }}</p>

    <MyButton modifier="create" @click="showDialog"> Создать отдел</MyButton>
    <MyButton modifier="showHistory" @click="showDeleteHistory"> Посмотреть удаленные отделы</MyButton>

    <div class="departments-section">
      <h2>Отделы</h2>

      <organizationDepartmentTree
        :departments="departments"
        @departmentUpdated="handleDepartmentUpdate"
        @departmentDeleted="departmentDeleted"
      />
    </div>

    <!-- Пагинация -->
    <MyPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="changePage"
    />

    <router-link to="/organization">
      <MyButton modifier="create"> Вернуться к списку организаций</MyButton>
    </router-link>
  </div>
  <!--Модальное окно создания отдела-->
  <MyModalWindow v-model:show="dialogVisible">
    <DepartmentCreateForm
      :cancel="cancelCreate"
      :organizationId="organization.id"
      :departments="departments"
      @created="loadOrganization"
    />
  </MyModalWindow>
  <!--Модальное окно просмотра удаленных отделов-->
  <MyModalWindow v-model:show="dialogVisibleDeleteHistory">
    <DepartmentDeleteHistory
      :cancel="cancelCreate"
      :organizationName="organization.name"
    />
  </MyModalWindow>
</template>

<script>
import organizationDepartmentTree from '@/components/organizations/organizationDepartmentTree.vue';
import { fetchOrganizationWithDepartments } from '@/http/organizationAPI.js';
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import DepartmentCreateForm from '@/components/departments/departmentCreateForm.vue';
import MyButton from '@/components/UI/MyButton.vue';
import MyPagination from '@/components/UI/MyPagination.vue';
import DepartmentDeleteHistory from '@/components/departments/departmentModal/departmentDeleteHistory.vue';

export default {
  components: {
    DepartmentDeleteHistory,
    MyPagination,
    MyButton,
    DepartmentCreateForm,
    MyModalWindow,
    organizationDepartmentTree,
  },
  data() {
    return {
      organization: {},
      departments: [],
      dialogVisible: false,
      dialogVisibleDeleteHistory: false,
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    };
  },
  async created() {
    await this.loadOrganization();
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
    },
    showDeleteHistory() {
      this.dialogVisibleDeleteHistory = true;
    },
    cancelCreate() {
      this.dialogVisible = false;
      this.dialogVisibleDeleteHistory = false;
    },

    async loadOrganization() {
      try {
        const organizationId = this.$route.params.id;
        const response = await fetchOrganizationWithDepartments(organizationId, this.currentPage, this.pageSize);
        console.log('Данные организации:', response.data);
        this.organization = response.data.organization;
        this.departments = response.data.departments || [];
        this.totalItems = response.data.count; // количество родительских отделов

        this.dialogVisible = false;
      } catch (error) {
        console.error('Ошибка при загрузке организации:', error);
      }
    },

    handleDepartmentUpdate() {
      try {
        this.loadOrganization();
      } catch (error) {
        console.error('Ошибка при обновлении отдела:', error);
      }
    },

    departmentDeleted(departmentId) {
      this.departments = this.departments.filter(
        (department) => department.id !== departmentId,
      );
      this.loadOrganization();
    },
    changePage(page) {
      this.currentPage = page;
      this.loadOrganization();
    },
  },
  mounted() {
    this.loadOrganization();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/styles/base" as *;

.organization-info {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    color: $primary-color;
    margin-bottom: 10px;
    font-size: $font-size-title;
  }

  p {
    color: $text-color-secondary;
    margin-bottom: 25px;
    font-size: $font-size-text;
    line-height: 1.5;
  }

  .departments-section {
    margin: 30px 0;

    h2 {
      color: $primary-color;
      font-size: $font-size-title;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid rgba($primary-color-dark, 0.2);
    }
  }

  a {
    display: inline-block;
    color: $primary-color;
    text-decoration: none;
    font-weight: 500;
    margin-top: 20px;
    transition: color 0.2s;

    &:hover {
      color: $primary-color;
      text-decoration: underline;
    }
  }
}
</style>
