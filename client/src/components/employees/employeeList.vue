<template>
  <div class="employeeList">
    <h3>Список сотрудников</h3>
    <div class="btn-active" style="margin-bottom: 20px">
      <MyButton modifier="create" @click="showEmployeeCreate"
      >Создать сотрудника</MyButton
      >
      <MyButton modifier="showHistory" @click="showFireHistory"
      >Просмотр уволенных сотрудников</MyButton
      >
    </div>


    <!-- Добавляем поле для поиска с кнопкой -->
    <div class="search-container">
      <MyInput
        type="text"
        v-model="searchQuery"
        placeholder="Поиск по ФИО..."
        class="search-input"
        @input="debounceSearch"
      />
      <MyButton
        modifier="cancel"
        v-if="searchQuery"
        @click="clearSearch"
        class="search-button clear-button"
      >
        ✕
      </MyButton>
    </div>

    <div class="sort-container">
      <MySelect
        v-model="selectedSort"
        :options="sortOptions"
        placeholder="Сортировка по..."
        @change="handleSortChange"
      />
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
    <EmployeeFireHistory :cancel="cancelModal" />
  </MyModalWindow>
  <MyModalWindow v-model:show="dialogCreateEmployee">
    <EmployeeCreate :cancel="cancelModal" @created="createdEmployee" />
  </MyModalWindow>
</template>

<script>
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import EmployeeItem from '@/components/employees/employeeItem.vue';
import EmployeeFireHistory from '@/components/employees/emloyeeModal/employeeFireHistory.vue';
import EmployeeCreate from '@/components/employees/emloyeeModal/employeeCreate.vue';
import MySelect from '@/components/UI/MySelect.vue';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: {
    MyButton,
    MyInput,
    MySelect,
    EmployeeCreate,
    MyModalWindow,
    EmployeeItem,
    EmployeeFireHistory,
  },
  props: {
    employees: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogFireHistory: false,
      dialogCreateEmployee: false,
      selectedSort: '',
      searchQuery: '', // Поле для поискового запроса
      sortOptions: [
        { value: 'organization', name: 'Организации' },
        { value: 'department', name: 'Отдел' },
      ],
    };
  },
  computed: {
    // Теперь сортируем только по локальным полям, поиск происходит на сервере
    sortedEmployees() {
      if (
        !this.selectedSort ||
        !['last_name', 'first_name'].includes(this.selectedSort)
      ) {
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
      this.searchQuery = '';
      this.$emit('search', '');
    },
  },
  watch: {
    selectedSort(newValue) {
      if (newValue) {
        this.handleSortChange();
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/styles/base" as *;
$section-gap: 20px;

.employeeList {
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  font-family: $font-family;

  h3 {
    color: $primary-color;
    margin-bottom: 20px;
    font-size: $font-size-title;
  }


}

.search-container {
  position: relative;
  max-width: 1280px;
  margin-bottom: 20px;

  .search-button {
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    color: $text-color-secondary;

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
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.no-results {
  color: $text-color-secondary;
  font-style: italic;
  text-align: center;
  grid-column: 1 / -1;
  padding: 20px;
}
</style>
