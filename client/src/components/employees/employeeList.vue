<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <button @click="showEmployeeCreate">Создать сотрудника</button>
    <button @click="showFireHistory">Просмотр уволенных сотрудников</button>

    <!-- Добавляем поле для поиска с кнопкой -->
    <div class="search-container">
      <input
          type="text"
          v-model="searchQuery"
          placeholder="Поиск по ФИО..."
          class="search-input"
          @input="debounceSearch"
      />
      <button v-if="searchQuery" @click="clearSearch" class="search-button clear-button">✕</button>
    </div>

    <div class="sort-container">
      <MySelect v-model="selectedSort" :options="sortOptions" @change="handleSortChange"/>
    </div>

    <div class="positionList__items">
      <template v-if="employees.length">
        <EmployeeItem
            v-for="employee in sortedEmployees"
            :key="employee.id"
            :employee="employee"
            @update="updateEmployee"
            :sortBy="selectedSort"
        />
      </template>
      <template v-else>
        <p class="no-results">Сотрудников не найдено</p>
      </template>
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
      searchQuery: "", // Поле для поискового запроса
      sortOptions: [
        {value: "organization", name: "Организации"},
        {value: "department", name: "Отдел"},
      ],
    }
  },
  computed: {
    // Теперь сортируем только по локальным полям, поиск происходит на сервере
    sortedEmployees() {
      if (!this.selectedSort || !['last_name', 'first_name'].includes(this.selectedSort)) {
        return this.employees;
      }

      return [...this.employees].sort((a, b) => {
        const field = this.selectedSort;
        const valueA = a[field]?.toLowerCase() || '';
        const valueB = b[field]?.toLowerCase() || '';

        if (this.sortOrder === 'ASC') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      });
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
    // Обработка изменения сортировки с учетом локальной сортировки
    handleSortChange() {
      if (this.selectedSort) {
        this.$emit('sort-change', {
          value: this.selectedSort,

        });
      }
    },
    // Переключение порядка сортировки
    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 600); // задержка в 300 мс между вводом и поиском
    },
    // Выполнение поиска при нажатии кнопки или Enter
    performSearch() {
      this.$emit('search', this.searchQuery);
    },
    // Очистка поискового запроса
    clearSearch() {
      this.searchQuery = "";
      this.$emit('search', "");
    }
  },
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
</style>