<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <button @click="showEmployeeCreate">Создать сотрудника</button>
    <button @click="showFireHistory">Просмотр уволенных сотрудников</button>
    <MySelect v-model="selectedSort" :options="sortOptions"/>
    <div class="positionList__items">
      <EmployeeItem
          v-for="employee in sortedEmployees"
          :key="employee.id"
          :employee="employee"
          @update="updateEmployee"
          @hr-info-loaded="handleHRInfo"
          :sortBy="selectedSort"
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
  computed: {
    sortedEmployees() {
      // Если сортировка не выбрана, возвращаем исходный массив
      if (!this.selectedSort || Object.keys(this.hrInfoMap).length === 0) {
        return this.employees;
      }

      // Создаем копию массива для сортировки
      return [...this.employees].sort((a, b) => {
        const hrInfoA = this.hrInfoMap[a.id];
        const hrInfoB = this.hrInfoMap[b.id];

        // Если для какого-то сотрудника нет HR-информации, он идет в конец
        if (!hrInfoA) return 1;
        if (!hrInfoB) return -1;

        // Сортировка по выбранному полю
        switch (this.selectedSort) {
          case 'organization':
            // Сортировка по организации (если есть)
            if (hrInfoA.organization && hrInfoB.organization) {
              return hrInfoA.organization - hrInfoB.organization;
            }
            return hrInfoA.organization ? -1 : 1;

          case 'department':
            // Сортировка по отделу (если есть)
            if (hrInfoA.department && hrInfoB.department) {
              return hrInfoA.department.localeCompare(hrInfoB.department);
            }
            return hrInfoA.department ? -1 : 1;

          // case 'position':
          //   // Сортировка по должности (если есть)
          //   if (hrInfoA.position && hrInfoB.position) {
          //     return hrInfoA.position.localeCompare(hrInfoB.position);
          //   }
          //   return hrInfoA.position ? -1 : 1;
          //
          // case 'salary':
          //   // Сортировка по зарплате (по возрастанию)
          //   if (hrInfoA.salary && hrInfoB.salary) {
          //     return hrInfoA.salary - hrInfoB.salary;
          //   }
          //   return hrInfoA.salary ? -1 : 1;

          default:
            return 0;
        }
      });
    }
  },
  watch: {
    selectedSort(newValue) {
      console.log("Выбрана сортировка:", newValue);
      // Здесь можно добавить дополнительную логику при изменении сортировки
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
    handleHRInfo({employeeId, hrInfo}) {
      this.hrInfoMap[employeeId] = hrInfo;
      console.log('Обновлена HR-информация:', this.hrInfoMap);
    },
  }
}
</script>

<style scoped lang="scss">

</style>