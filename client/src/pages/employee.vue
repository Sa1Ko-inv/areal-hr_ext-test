<!--TODO: сортировка по hr_operation показано в недоумении-->
<script>
import EmployeeList from "@/components/employees/employeeList.vue";
import {fetchEmployees} from "@/http/employeeAPI.js";
import MySelect from "@/components/UI/MySelect.vue";

export default {
  components: {MySelect, EmployeeList},
  data() {
    return {
      employees: [],
      currentPage: 1,
      pageSize: 5, // Увеличил размер страницы для удобства
      totalItems: 0,
      updateError: null, // Добавляем для хранения ошибок обновления
      selectedSort: "",
      sortOrder: "", // Направление сортировки
    }
  },
  methods: {
    async getEmployees() {
      try {
        const response = await fetchEmployees(this.currentPage, this.pageSize, this.sortOrder || 'asc', this.selectedSort || 'id');
        if (response && response.data) {
          this.employees = response.data.rows || [];
          this.totalItems = response.data.count || 0;
        } else {
          console.error("Некорректный формат ответа:", response);
        }
      } catch (error) {
        console.error("Ошибка при получении сотрудников:", error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getEmployees();
    },
    // Метод для обработки события создания сотрудника
    handleEmployeeCreated() {
      // После создания сотрудника переходим на первую страницу и обновляем список
      this.currentPage = 1;
      this.getEmployees();
    },
    // Обработчик обновления списка сотрудников
    handleUpdateEmployees(updatedEmployee) {
      // Обновляем только конкретного сотрудника, сохраняя порядок
      this.employees = this.employees.map(emp =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
    },
    handleSortChange({ selectedSort, sortOrder }) {
      // Обновляем параметры сортировки и загружаем данные
      this.selectedSort = selectedSort;
      this.sortOrder = sortOrder;
      this.getEmployees();
    },
  },
  mounted() {
    this.getEmployees();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1; // Добавляем защиту от деления на ноль
    }
  },

  watch: {
    selectedSort(newValue) {
      this.currentPage = 1; // Возвращаемся на первую страницу при изменении сортировки
      this.getEmployees(); // Обновляем список сотрудников с новой сортировкой
    },
  },
}
</script>

<template>
  <div class="">

    <EmployeeList
        :employees="employees"
        :updateError="updateError"
        :selectedSort="selectedSort"
        :sortOrder="sortOrder"
        @created="handleEmployeeCreated"
        @update-employees="handleUpdateEmployees"
        @sort-change="handleSortChange"
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
