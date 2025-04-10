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

<style scoped lang="scss">
$primary-color: #792ec9;
$primary-color-dark: #6525a7;
$border-color: #e0e0e0;
$text-color-primary: #333;
$background-color-light: #fff;
$danger-color: #dc3545;
$success-color: #28a745;
$border-radius: 8px;
$box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
$font-family: 'Arial', sans-serif;
$section-gap: 20px;
$button-padding: 10px 18px;

.employeeList {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  font-family: $font-family;

  h3 {
    color: $primary-color;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }

  button {
    padding: $button-padding;
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: calc($border-radius / 2);
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 15px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $primary-color-dark;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.search-container {
  position: relative;
  max-width: 400px;
  margin-bottom: 20px;

  .search-input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
    }
  }

  .search-button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    color: #666;

    &:hover {
      color: $text-color-primary;
    }

    &.clear-button {
      font-size: 1.2rem;
      line-height: 1;
    }
  }
}

.sort-container {
  margin-bottom: 20px;
  max-width: 300px;
}

.positionList__items {
  //display: grid;
  //grid-template-columns: 1fr;
  //gap: $section-gap;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.no-results {
  color: #666;
  font-style: italic;
  text-align: center;
  grid-column: 1 / -1;
  padding: 20px;
}
</style>