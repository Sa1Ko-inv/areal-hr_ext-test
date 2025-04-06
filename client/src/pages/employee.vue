<script>
import EmployeeList from "@/components/employees/employeeList.vue";
import {fetchEmployees} from "@/http/employeeAPI.js";

export default {
  components: {EmployeeList},
  data() {
    return {
      employees: [],
      currentPage: 1,
      pageSize: 5, // Увеличил размер страницы для удобства
      totalItems: 0
    }
  },
  methods: {
    async getEmployees() {
      try {
        const response = await fetchEmployees(this.currentPage, this.pageSize);
        // Проверяем, что ответ имеет правильную структуру
        if (response && response.data) {
          this.employees = response.data.rows || [];
          this.totalItems = response.data.count || 0;
        } else {
          console.error('Некорректный формат ответа:', response);
        }
      } catch (error) {
        console.error('Ошибка при получении сотрудников:', error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getEmployees();
    },
    // Добавляем метод для обработки события создания сотрудника
    handleEmployeeCreated() {
      // После создания сотрудника переходим на первую страницу и обновляем список
      this.currentPage = 1;
      this.getEmployees();
    }
  },
  mounted() {
    this.getEmployees();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1; // Добавляем защиту от деления на ноль
    }
  }
}
</script>

<template>
  <div class="">
    <EmployeeList
        :employees="employees"
        @created="handleEmployeeCreated"
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

      <span class="pagination-info">Страница {{ currentPage }} из {{ totalPages }}</span>

      <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="pagination-button"
      >
        Следующая
      </button>
    </div>
  </div>
</template>

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
