<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <button>Создать сотрудника</button>
    <button @click="showFireHistory">Просмотр уволенных сотрудников</button>

    <div class="positionList__items">
      <EmployeeItem
          v-for="employee in employees"
          :employee="employee"
          :key="employee.id"
          :error="updateError?.id === employee.id ? employee.message : null"
          @update=""
          @delete=""
      />
    </div>

  </div>

  <!-- Модальное окно истории просмотра уволенных сотрудников -->
  <MyModalWindow v-model:show="dialogFireHistory" >
    <EmployeeFireHistory
        :cancel="cancelModal"
    />
  </MyModalWindow>
</template>

<script>

import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import EmployeeItem from "@/components/employees/employeeItem.vue";
import EmployeeFireHistory from "@/components/employees/emloyeeModal/employeeFireHistory.vue";

export default {
  components: {
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
    }
  },
  methods: {
    showFireHistory() {
      this.dialogFireHistory = true;
    },
    cancelModal() {
      this.dialogFireHistory = false;
    },
  }

}
</script>

<style scoped lang="scss">

</style>