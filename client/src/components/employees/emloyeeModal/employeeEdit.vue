<template>
  <div class="employee-edit-form">
    <h2>Редактирование сотрудника</h2>
    <div class="form-section">
      <h3>Личная информация</h3>
      <div class="form-group">
        <label>Фамилия:</label>
        <input v-model="editedEmployee.last_name" type="text">
      </div>
      <div class="form-group">
        <label>Имя:</label>
        <input v-model="editedEmployee.first_name" type="text">
      </div>
      <div class="form-group">
        <label>Отчество:</label>
        <input v-model="editedEmployee.middle_name" type="text">
      </div>
      <div class="form-group">
        <label>Дата рождения:</label>
        <input v-model="editedEmployee.birth_date" type="text">
      </div>
    </div>
    <div class="form-section" v-if="editedEmployee.passport">
      <h3>Данные паспорта</h3>
      <div class="form-group">
        <label>Серия:</label>
        <input v-model="editedEmployee.passport.series" type="text">
      </div>
      <div class="form-group">
        <label>Номер:</label>
        <input v-model="editedEmployee.passport.number" type="text">
      </div>
      <div class="form-group">
        <label>Кем выдан:</label>
        <input v-model="editedEmployee.passport.issued_by" type="text">
      </div>
      <div class="form-group">
        <label>Дата выдачи:</label>
        <input v-model="editedEmployee.passport.issued_date" type="text">
      </div>
      <div class="form-group">
        <label>Код подразделения:</label>
        <input v-model="editedEmployee.passport.division_code" type="text">
      </div>
    </div>
    <div class="form-section" v-if="editedEmployee.address">
      <h3>Адрес</h3>
      <div class="form-group">
        <label>Регион:</label>
        <input v-model="editedEmployee.address.region" type="text">
      </div>
      <div class="form-group">
        <label>Населенный пункт:</label>
        <input v-model="editedEmployee.address.locality" type="text">
      </div>
      <div class="form-group">
        <label>Улица:</label>
        <input v-model="editedEmployee.address.street" type="text">
      </div>
      <div class="form-group">
        <label>Дом:</label>
        <input v-model="editedEmployee.address.house" type="text">
      </div>
      <div class="form-group">
        <label>Корпус:</label>
        <input v-model="editedEmployee.address.building" type="text">
      </div>
      <div class="form-group">
        <label>Квартира:</label>
        <input v-model="editedEmployee.address.apartment" type="text">
      </div>
    </div>
    <div class="form-actions">
      <button @click="saveEmployeeChanges" class="action-button action-button--success">Сохранить</button>
      <button @click="cancel" class="action-button">Отмена</button>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { updateEmployees } from "@/http/employeeAPI.js";

export default {
  name: 'EmployeeEdit',
  props: {
    employee: {
      type: Object,
      required: true,
    },
    cancel: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      editedEmployee: {},
      originalEmployee: {},
      error: null
    };
  },
  methods: {
    // Метод для сравнения объектов и выявления изменений
    getChangedData(original, edited) {
      const changes = {};
      // Сравниваем только верхний уровень, так как Vue и так отслеживает изменения вложенных объектов
      for (const key in edited) {
        if (JSON.stringify(original[key]) !== JSON.stringify(edited[key])) {
          changes[key] = edited[key];
        }
      }
      if (Object.keys(changes).length > 0) {
        changes.id = original.id;
      }
      return changes;
    },

    // Оптимизированный метод сохранения изменений
    async saveEmployeeChanges() {
      try {
        const changedData = this.getChangedData(this.originalEmployee, this.editedEmployee);
        if (Object.keys(changedData).length > 1) {
          await updateEmployees(this.employee.id, changedData);
          // Передаем обновленные данные вместо только ID
          this.$emit('employee-updated', this.editedEmployee);
        }
        this.cancel();
      } catch (error) {
        console.error("Ошибка при обновлении сотрудника:", error);
        this.error = error.response?.data?.message || 'Ошибка при обновлении сотрудника';
        this.$emit('update-error', {
          id: this.employee.id,
          message: this.error
        });
      }
    }
  },
  created() {
    // Создаем глубокие копии объекта сотрудника при создании компонента
    this.editedEmployee = JSON.parse(JSON.stringify(this.employee));
    this.originalEmployee = JSON.parse(JSON.stringify(this.employee));
  }
};
</script>

<style scoped lang="scss">
$primary-color: #792ec9;
$primary-color-dark: #6525a7;
$border-color: #e0e0e0;
$text-color-primary: #333;
$text-color-secondary: #555;
$danger-color: #dc3545;
$success-color: #28a745;
$success-color-dark: #218838;
$border-radius: 8px;

.employee-edit-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: $border-radius;

  h2 {
    color: $primary-color;
    margin-bottom: 20px;
    text-align: center;
  }

  .form-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid $border-color;

    h3 {
      color: $text-color-primary;
      margin-bottom: 15px;
      font-size: 1.1rem;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .form-group {
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;

    label {
      flex: 0 0 180px;
      font-weight: 600;
      color: $text-color-secondary;
      margin-right: 10px;
      padding-top: 8px;
    }

    input {
      flex: 1 1 300px;
      padding: 8px 12px;
      border: 1px solid $border-color;
      border-radius: 4px;
      font-size: 0.95rem;

      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 25px;
  }

  .action-button {
    padding: 10px 18px;
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: calc($border-radius / 2);
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
    font-weight: 500;
    font-size: 0.9rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      background-color: $primary-color-dark;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    &--success {
      background-color: $success-color;

      &:hover {
        background-color: $success-color-dark;
      }
    }
  }

  .error-message {
    margin-top: 15px;
    padding: 10px;
    color: white;
    background-color: $danger-color;
    border-radius: 4px;
    text-align: center;
  }
}
</style>
