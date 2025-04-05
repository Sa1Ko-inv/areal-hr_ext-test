<script>
import EmployeeList from "@/components/employees/employeeList.vue";
import {fetchEmployees} from "@/http/employeeAPI.js";

export default {
  components: {EmployeeList},
  data() {
    return {
      employees: [],
      // createError: null,
      // updateError: null, // Добавляем состояние для ошибки обновления
      // updatingEmployeeId: null, // Для отслеживания какой должности показывать ошибку
      currentPage: 1,
      pageSize: 2,
      totalItems: 0
    }
  },
  methods: {
    async getEmployees() {
      try {
        const response = await fetchEmployees(this.currentPage, this.pageSize);
        this.employees = response.data.rows;
        this.totalItems = response.data.count;
        this.files = response.data.files;
      } catch (error) {
        console.error('Ошибка при получении сотрудников:', error);
      }
    },

    changePage(page) {
      this.currentPage = page;
      this.getEmployees();
    }
  },

  mounted() {
    this.getEmployees();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    }
  }
}
</script>

<template>
  <div class="">
    <EmployeeList
    :employees="employees"
    />

    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Предыдущая</button>
    <span>Страница {{ currentPage }} из {{ totalPages }}</span>
    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Следующая</button>
  </div>
</template>

<style scoped>

</style>