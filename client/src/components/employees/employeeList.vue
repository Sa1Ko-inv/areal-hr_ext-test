<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <button @click="showEmployeeCreate">Создать сотрудника</button>
    <button @click="showFireHistory">Просмотр уволенных сотрудников</button>

    <div class="sort-container">
      <MySelect v-model="selectedSort" :options="sortOptions" @change="handleSortChange"/>
    </div>

    <div class="positionList__items">
      <EmployeeItem
          v-for="employee in employees"
          :key="employee.id"
          :employee="employee"
          @update="updateEmployee"
          @hr-info-loaded="handleHRInfo"
          :sortBy="selectedSort"
      />
    </div>
  </div>
  <!-- Модальные окна остаются без изменений -->
  <MyModalWindow v-model:show="dialogFireHistory">
    <EmployeeFireHistory
        :cancel="cancelModal"
    />
  </MyModalWindow>
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
import MySelect from "@/components/UI/MySelect.vue";

export default {
  components: {
    MySelect,
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
      selectedSort: "",
      hrInfoMap: {},
      sortOptions: [
        {value: "organization", name: "Организации"},
        {value: "department", name: "Отдел"},
      ],
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
    updateEmployee(updatedEmployee) {
      this.$emit('update-employees', updatedEmployee);
    },
    handleHRInfo({employeeId, hrInfo}) {
      this.hrInfoMap[employeeId] = hrInfo;
    },
    // Новый метод для обработки изменения сортировки
    handleSortChange() {
      if (this.selectedSort) {
        this.$emit('sort-change', {
          value: this.selectedSort,
          order: this.sortOrder
        });
      }
    },
  },
  // Следим за изменениями выбранной сортировки
  watch: {
    selectedSort(newValue) {
      if (newValue) {
        this.handleSortChange();
      }
    }
  }
}
</script>

<style scoped>
.sort-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.sort-order-button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
}
</style>