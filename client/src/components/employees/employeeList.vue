<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <button>Создать сотрудника</button>
    <button>просмотр уволенных сотрудников</button>


    <MyModalWindow>
<!--      <EmployeeCreateForm-->
<!--        @create="createEmployee"-->
<!--        :cancel="cancelCreate"-->
<!--        :error="createError"-->
<!--      />-->
    </MyModalWindow>

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
</template>

<script setup>

import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import EmployeeItem from "@/components/employees/employeeItem.vue";

defineProps({
  employees: {
    type: Array,
    required: true
  },
  // createError: {
  //   type: String,
  //   default: null
  // },
  // updateError: { // Добавляем проп для ошибки обновления
  //   type: Object,
  //   default: null
  // }
})
</script>

<style scoped lang="scss">

</style>