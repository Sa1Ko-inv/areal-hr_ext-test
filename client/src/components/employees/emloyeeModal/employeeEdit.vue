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
        <MyInput v-model="editedEmployee.last_name" type="text" />
      </div>
      <div class="form-group">
        <label>Имя:</label>
        <MyInput v-model="editedEmployee.first_name" type="text" />
      </div>
      <div class="form-group">
        <label>Отчество:</label>
        <MyInput v-model="editedEmployee.middle_name" type="text" />
      </div>
      <div class="form-group">
        <label>Дата рождения:</label>
        <el-date-picker
          v-model="editedEmployee.birth_date"
          type="date"
          placeholder="Выберите дату"
          format="DD/MM/YYYY"
          value-format="DD/MM/YYYY"
          style="width: 100%; height: 42px"
          size="large"
        />
      </div>
    </div>
    <div class="form-section" v-if="editedEmployee.passport">
      <h3>Данные паспорта</h3>
      <div class="form-group">
        <label>Серия:</label>
        <MyInput v-mask="'####'" v-model="editedEmployee.passport.series" type="text" />
      </div>
      <div class="form-group">
        <label>Номер:</label>
        <MyInput v-mask="'######'" v-model="editedEmployee.passport.number" type="text" />
      </div>
      <div class="form-group">
        <label>Кем выдан:</label>
        <MyInput v-model="editedEmployee.passport.issued_by" type="text" />
      </div>
      <div class="form-group">
        <label>Дата выдачи:</label>
        <el-date-picker
          v-model="editedEmployee.passport.issued_date"
          type="date"
          placeholder="Выберите дату"
          format="DD/MM/YYYY"
          value-format="DD/MM/YYYY"
          style="width: 100%; height: 42px"
          size="large"
        />
      </div>
      <div class="form-group">
        <label>Код подразделения:</label>
        <MyInput v-mask="'###-###'" v-model="editedEmployee.passport.division_code" type="text" />
      </div>
    </div>
    <div class="form-section" v-if="editedEmployee.address">
      <h3>Адрес</h3>
      <div class="form-group">
        <label>Регион:</label>
        <MyInput v-model="editedEmployee.address.region" type="text" />
      </div>
      <div class="form-group">
        <label>Населенный пункт:</label>
        <MyInput v-model="editedEmployee.address.locality" type="text" />
      </div>
      <div class="form-group">
        <label>Улица:</label>
        <MyInput v-model="editedEmployee.address.street" type="text" />
      </div>
      <div class="form-group">
        <label>Дом:</label>
        <MyInput v-model="editedEmployee.address.house" type="text" />
      </div>
      <div class="form-group">
        <label>Корпус:</label>
        <MyInput v-model="editedEmployee.address.building" type="text" />
      </div>
      <div class="form-group">
        <label>Квартира:</label>
        <MyInput v-model="editedEmployee.address.apartment" type="text" />
      </div>
    </div>
    <div class="form-actions">
      <MyButton modifier="save" @click="saveEmployeeChanges">
        Сохранить
      </MyButton>
      <MyButton modifier="cancel" @click="cancel">Отмена</MyButton>
    </div>
  </div>
</template>

<script>
import { updateEmployees } from '@/http/employeeAPI.js';
import MyButton from '@/components/UI/MyButton.vue';
import MyInput from '@/components/UI/MyInput.vue';

export default {
  name: 'EmployeeEdit',
  components: { MyInput, MyButton },
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
@use "@/styles/base" as *;
.employee-edit-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  background-color: $background-color-light;

  h2 {
    color: $primary-color;
    margin-bottom: 20px;
    font-size: $font-size-title;
    text-align: center;
  }

  h3 {
    color: $text-color-primary;
    margin-bottom: 15px;
    font-size: $font-size-text;
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
      color: $text-color-secondary;
    }
  }

  .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .error-message {
    margin-bottom: 15px;
    padding: 10px;
    background-color: rgba($danger-color-dark, 0.1);
    border-radius: $border-radius;
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
    }
  }
}
</style>
