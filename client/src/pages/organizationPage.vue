<template>
  <OrganizationList
    :organizations="sortedOrganizations"
    :createError="errors"
    :updateError="updateError"
    @create="createOrganization"
    @update="updateOrganization"
    @delete="deleteOrganization"
  />

  <!-- Пагинация -->
  <MyPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @page-change="changePage"
  />
</template>

<script>
import OrganizationList from '@/components/organizations/organizationList.vue';
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
} from '@/http/organizationAPI.js';
import MyPagination from '@/components/UI/MyPagination.vue';

export default {
  components: { MyPagination, OrganizationList },
  data() {
    return {
      organizations: [],
      errors: {
        name: null,
        comment: null,
        general: null
      },
      updateError: null, // Добавляем состояние для ошибки обновления
      updatingOrganizationId: null, // Для отслеживания какой организации показывать ошибку
      currentPage: 1,
      pageSize: 7,
      totalItems: 0,
    };
  },
  computed: {
    sortedOrganizations() {
      return [...this.organizations].sort((a, b) => a.id - b.id);
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    },
  },
  methods: {
    async getOrganizations() {
      try {
        const response = await fetchOrganizations(
          this.currentPage,
          this.pageSize
        );
        this.organizations = response.data.rows;
        this.totalItems = response.data.count;
      } catch (error) {
        console.error('Ошибка при получении организаций:', error);
      }
    },
    async createOrganization({ organization , onSuccess}) {
      try {
        // Сбрасываем ошибку перед запросом
        this.errors = {
          name: null,
          comment: null,
          general: null,
        };
        const response = await createOrganization(
          organization.name,
          organization.comment
        );
        this.organizations.push(response.data);
        this.getOrganizations();

        onSuccess();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            if (err.field && Object.prototype.hasOwnProperty.call(this.errors, err.field)) {
              this.errors[err.field] = err.message;
            } else {
              this.errors.general = err.message;
            }
          });
        } else {
          this.createError = 'Произошла ошибка при создании организации';
        }
        console.error('Ошибка при создании организации:', error);
      }
    },
    async updateOrganization(updatedOrganization) {
      try {
        this.updateError = null; // Сбрасываем ошибку
        this.updatingOrganizationId = updatedOrganization.id; // Запоминаем ID организации
        await updateOrganization(
          updatedOrganization.id,
          updatedOrganization.name,
          updatedOrganization.comment
        );
        this.getOrganizations();
        this.updatingOrganizationId = null; // Сбрасываем после успеха
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.updateError = {
            id: updatedOrganization.id,
            message: error.response.data.errors[0].message,
          };
        } else {
          this.updateError = {
            id: updatedOrganization.id,
            message: 'Произошла ошибка при обновлении организации',
          };
        }
        console.error('Ошибка при обновлении организации:', error);
      }
    },

    async deleteOrganization(id) {
      try {
        await deleteOrganization(id);
        this.organizations = this.organizations.filter((org) => org.id !== id);
      } catch (error) {
        console.error('Ошибка при удалении организации:', error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getOrganizations();
    },
  },

  mounted() {
    this.getOrganizations();
  },
};
</script>

<style lang="scss" scoped>
</style>
