<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <button @click="showEmployeeCreate">Создать сотрудника</button>
    <button @click="showFireHistory">Просмотр уволенных сотрудников</button>
    <div class="positionList__items">
      <EmployeeItem
          v-for="employee in employees"
          :key="employee.id"
          :employee="employee"
          @update="updateEmployee"
      />
    </div>
  </div>

  <!-- Модальное окно истории просмотра уволенных сотрудников -->
  <MyModalWindow v-model:show="dialogFireHistory">
    <EmployeeFireHistory
        :cancel="cancelModal"
    />
  </MyModalWindow>

  <!-- Модальное окно создания сотрудника -->
  <MyModalWindow v-model:show="dialogCreateEmployee">
    <EmployeeCreate
        :cancel="cancelModal"
        @created="createdEmployee"
    />
  </MyModalWindow>
</template>

<script>
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import EmployeeItem from "@/components/employees/employeeItem.vue";
import EmployeeFireHistory from "@/components/employees/emloyeeModal/employeeFireHistory.vue";
import EmployeeCreate from "@/components/employees/emloyeeModal/employeeCreate.vue";
import {fetchEmployees, updateEmployees} from "@/http/employeeAPI.js";

export default {
  components: {
    EmployeeCreate,
    MyModalWindow,
    EmployeeItem,
    EmployeeFireHistory
  },
  props: {
    employees: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      dialogFireHistory: false,
      dialogCreateEmployee: false,
    }
  },
  methods: {
    showFireHistory() {
      this.dialogFireHistory = true;
    },
    showEmployeeCreate() {
      this.dialogCreateEmployee = true;
    },
    cancelModal() {
      this.dialogFireHistory = false;
      this.dialogCreateEmployee = false;
    },
    createdEmployee() {
      this.$emit('created');
      this.dialogCreateEmployee = false;
    },
    // Обработчик обновления сотрудника
    updateEmployee(updatedEmployee) {
      // Обновляем локальный список сотрудников
      // Прокидываем событие в родительский компонент
      this.$emit('update-employees', updatedEmployee);
    },

  }
}
</script>

<style scoped lang="scss">

</style>