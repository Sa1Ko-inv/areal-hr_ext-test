<template>
  <div class="employee-edit-form">
    <h2>Редактирование сотрудника</h2>
    <div v-if="updateError" class="error-message">
      {{ updateError.message }}
    </div>
    <div class="form-section">
      <h3>Личная информация</h3>
      <div class="form-group">
        <label>Фамилия:</label>
        <input v-model="editedEmployee.last_name" type="text" />
      </div>
      <div class="form-group">
        <label>Имя:</label>
        <input v-model="editedEmployee.first_name" type="text" />
      </div>
      <div class="form-group">
        <label>Отчество:</label>
        <input v-model="editedEmployee.middle_name" type="text" />
      </div>
      <div class="form-group">
        <label>Дата рождения:</label>
        <input v-model="editedEmployee.birth_date" type="text" />
      </div>
    </div>
    <div class="form-section" v-if="editedEmployee.passport">
      <h3>Данные паспорта</h3>
      <div class="form-group">
        <label>Серия:</label>
        <input v-model="editedEmployee.passport.series" type="text" />
      </div>
      <div class="form-group">
        <label>Номер:</label>
        <input v-model="editedEmployee.passport.number" type="text" />
      </div>
      <div class="form-group">
        <label>Кем выдан:</label>
        <input v-model="editedEmployee.passport.issued_by" type="text" />
      </div>
      <div class="form-group">
        <label>Дата выдачи:</label>
        <input v-model="editedEmployee.passport.issued_date" type="text" />
      </div>
      <div class="form-group">
        <label>Код подразделения:</label>
        <input v-model="editedEmployee.passport.division_code" type="text" />
      </div>
    </div>
    <div class="form-section" v-if="editedEmployee.address">
      <h3>Адрес</h3>
      <div class="form-group">
        <label>Регион:</label>
        <input v-model="editedEmployee.address.region" type="text" />
      </div>
      <div class="form-group">
        <label>Населенный пункт:</label>
        <input v-model="editedEmployee.address.locality" type="text" />
      </div>
      <div class="form-group">
        <label>Улица:</label>
        <input v-model="editedEmployee.address.street" type="text" />
      </div>
      <div class="form-group">
        <label>Дом:</label>
        <input v-model="editedEmployee.address.house" type="text" />
      </div>
      <div class="form-group">
        <label>Корпус:</label>
        <input v-model="editedEmployee.address.building" type="text" />
      </div>
      <div class="form-group">
        <label>Квартира:</label>
        <input v-model="editedEmployee.address.apartment" type="text" />
      </div>
    </div>
    <div class="form-actions">
      <button @click="saveEmployeeChanges" class="save-button">
        Сохранить
      </button>
      <button @click="cancel" class="cancel-button">Отмена</button>
    </div>
  </div>
</template>

<script>
import { updateEmployees } from '@/http/employeeAPI.js';

export default {
  name: 'EmployeeEdit',
  props: {
    employee: {
      type: Object,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      editedEmployee: {},
      originalEmployee: {},
      updateError: null,
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
        const changedData = this.getChangedData(
          this.originalEmployee,
          this.editedEmployee
        );
        if (Object.keys(changedData).length > 1) {
          await updateEmployees(this.employee.id, changedData);
          // Передаем полный обновленный объект
          this.$emit('employee-updated', { ...this.editedEmployee });
        }
        this.cancel();
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.updateError = {
            id: this.employee.id,
            message: error.response.data.errors[0].message,
          };
        } else {
          this.updateError = {
            id: this.employee.id,
            message: 'Произошла ошибка при обновлении сотрудника',
          };
        }
        console.error('Ошибка при обновлении сотрудника:', error);
      }
    },
  },
  created() {
    // Создаем глубокие копии объекта сотрудника при создании компонента
    this.editedEmployee = JSON.parse(JSON.stringify(this.employee));
    this.originalEmployee = JSON.parse(JSON.stringify(this.employee));
  },
};
</script>

<style scoped lang="scss">
.employee-edit-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(121, 46, 201, 0.1);
  background-color: #fff;

  h2 {
    color: #792ec9;
    margin-bottom: 20px;
    font-size: 1.5rem;
    text-align: center;
  }

  h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 1.1rem;
  }

  .form-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  .form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;

    label {
      margin-bottom: 5px;
      font-weight: 500;
      color: #555;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #792ec9;
        box-shadow: 0 0 0 2px rgba(121, 46, 201, 0.2);
      }

      &::placeholder {
        color: #aaa;
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;

    button {
      flex: 1;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .save-button {
      background-color: #792ec9;
      color: white;

      &:hover {
        background-color: #6525a7;
      }
    }

    .cancel-button {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;

      &:hover {
        background-color: #eaeaea;
      }
    }
  }

  .error-message {
    color: #d32f2f;
    font-size: 14px;
    margin-bottom: 15px;
    padding: 10px;
    background-color: rgba(211, 47, 47, 0.1);
    border-radius: 4px;
    text-align: center;
  }

  @media (min-width: 768px) {
    .form-group {
      flex-direction: row;
      align-items: center;

      label {
        flex: 0 0 180px;
        margin-bottom: 0;
        margin-right: 10px;
      }

      input {
        flex: 1;
      }
    }
  }
}
</style>
