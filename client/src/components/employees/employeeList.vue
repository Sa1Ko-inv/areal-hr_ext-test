<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <button @click="showEmployeeCreate">Создать сотрудника</button>
    <button @click="showFireHistory">Просмотр уволенных сотрудников</button>

    <MySelect v-model="localSelectedSort" :options="sortOptions" />
    <MySelect v-model="localSortOrder" :options="[{ value: 'asc', name: 'Возрастание' }, { value: 'desc', name: 'Убывание' }]" />

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
    selectedSort: {
      type: String,
      required: true,
    },
    sortOrder: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogFireHistory: false,
      dialogCreateEmployee: false,

      // Локальные данные для управления сортировкой
      localSelectedSort: this.selectedSort,
      localSortOrder: this.sortOrder,

      sortOptions: [
        { value: "last_name", name: "Фамилия" },
        { value: "first_name", name: "Имя" },
      ],
    }
  },
  watch: {
    localSelectedSort(newValue) {
      // Отправляем событие с новым значением сортировки
      this.$emit("sort-change", { selectedSort: newValue, sortOrder: this.localSortOrder });
    },
    localSortOrder(newValue) {
      // Отправляем событие с новым направлением сортировки
      this.$emit("sort-change", { selectedSort: this.localSelectedSort, sortOrder: newValue });
    },
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