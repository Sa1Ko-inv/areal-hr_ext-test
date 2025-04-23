<script>
import EmployeeList from '@/components/employees/employeeList.vue';
import { fetchEmployees } from '@/http/employeeAPI.js';
import MyPagination from '@/components/UI/MyPagination.vue';

export default {
  components: { MyPagination, EmployeeList },
  data() {
    return {
      employees: [],
      currentPage: 1,
      pageSize: 6,
      totalItems: 0,
      updateError: null,
      selectedSort: '',
      sortOrder: 'ASC',
      searchQuery: '', // Добавляем для хранения поискового запроса
    };
  },
  methods: {
    async getEmployees() {
      try {
        // Отправляем на сервер параметры сортировки и поиска
        const serverSort =
          this.selectedSort &&
          !['last_name', 'first_name'].includes(this.selectedSort)
            ? this.selectedSort
            : null;

        const response = await fetchEmployees(
          this.currentPage,
          this.pageSize,
          serverSort,
          this.sortOrder,
          this.searchQuery // Добавляем поисковый запрос
        );

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
    handleEmployeeCreated() {
      this.currentPage = 1;
      this.getEmployees();
    },
    handleUpdateEmployees(updatedEmployee) {
      this.employees = this.employees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
    },
    handleSortChange(sortData) {
      this.selectedSort = sortData.value;
      this.sortOrder = sortData.order || 'ASC';

      // Возвращаемся на первую страницу при смене сортировки
      this.currentPage = 1;
      this.getEmployees();
    },
    // Добавляем обработчик изменения поискового запроса
    handleSearch(query) {
      this.searchQuery = query;
      this.currentPage = 1; // Сбрасываем на первую страницу при поиске
      this.getEmployees();
    },
  },
  mounted() {
    this.getEmployees();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1;
    },
  },
};
</script>

<template>
  <div class="">
    <EmployeeList
      :employees="employees"
      :updateError="updateError"
      @created="handleEmployeeCreated"
      @update-employees="handleUpdateEmployees"
      @sort-change="handleSortChange"
      @search="handleSearch"
    />

    <!-- Пагинация -->
    <MyPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="changePage"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
