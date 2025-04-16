<template>
  <OrganizationList
    :organizations="sortedOrganizations"
    :createError="createError"
    :updateError="updateError"
    @create="createOrganization"
    @update="updateOrganization"
    @delete="deleteOrganization"
  />

  <!-- Пагинация -->
  <div class="pagination" v-if="totalPages > 1">
    <button
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      class="pagination-button"
    >
      Предыдущая
    </button>

    <span class="pagination-info"
      >Страница {{ currentPage }} из {{ totalPages }}</span
    >

    <button
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      class="pagination-button"
    >
      Следующая
    </button>
  </div>
</template>

<script>
import OrganizationList from '@/components/organizations/organizationList.vue';
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
} from '@/http/organizationAPI.js';

export default {
  components: { OrganizationList },
  data() {
    return {
      organizations: [],
      createError: null,
      updateError: null, // Добавляем состояние для ошибки обновления
      updatingOrganizationId: null, // Для отслеживания какой организации показывать ошибку
      currentPage: 1,
      pageSize: 5,
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
    async createOrganization(organization) {
      try {
        this.createError = null; // Сбрасываем ошибку перед запросом
        const response = await createOrganization(
          organization.name,
          organization.comment
        );
        this.organizations.push(response.data);
        this.getOrganizations();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.createError = error.response.data.errors[0].message; // Сохраняем сообщение об ошибке
          console.error('Ошибка при создании организации:', error);
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

<style scoped>
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination-button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 4px;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
}
</style>
