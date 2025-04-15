<template>
  <div class="form-container">
    <form @submit.prevent="createEmployee" class="employee-form">
      <h2 class="form-title">Создание сотрудника</h2>

      <div v-if="createError" class="error-message">{{ createError }}</div>

      <div class="form-section">
        <h3 class="section-title">Личная информация</h3>
        <div class="form-group">
          <label for="first_name">Имя</label>
          <MyInput
            id="first_name"
            type="text"
            v-model="employeeData.first_name"
            placeholder="Введите имя"
          />
        </div>

        <div class="form-group">
          <label for="last_name">Фамилия</label>
          <MyInput
            id="last_name"
            type="text"
            v-model="employeeData.last_name"
            placeholder="Введите фамилию"
          />
        </div>

        <div class="form-group">
          <label for="middle_name">Отчество</label>
          <MyInput
            id="middle_name"
            type="text"
            v-model="employeeData.middle_name"
            placeholder="Введите отчество"
          />
        </div>

        <div class="form-group">
          <label for="birth_date">Дата рождения</label>
          <MyInput
            id="birth_date"
            type="text"
            v-model="employeeData.birth_date"
            placeholder="дд/мм/гггг"
          />
        </div>

        <div class="form-group">
          <label for="files">Файлы сотрудника</label>
          <MyInput
            id="files"
            type="file"
            multiple
            @change="handleFileUpload"
            accept=".jpg,.jpeg"
          />
          <small>Поддерживаются только JPG/JPEG файлы</small>
          <div v-if="selectedFiles.length > 0" class="selected-files">
            <p>Выбрано файлов: {{ selectedFiles.length }}</p>
            <ul>
              <li v-for="(file, index) in selectedFiles" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Паспортные данные</h3>
        <div class="form-row">
          <div class="form-group half">
            <label for="passport_series">Серия паспорта</label>
            <MyInput
              id="passport_series"
              type="text"
              v-model="employeeData.passport.series"
              placeholder="0000"
            />
          </div>

          <div class="form-group half">
            <label for="passport_number">Номер паспорта</label>
            <MyInput
              id="passport_number"
              type="text"
              v-model="employeeData.passport.number"
              placeholder="000000"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="issued_by">Кем выдан</label>
          <MyInput
            id="issued_by"
            type="text"
            v-model="employeeData.passport.issued_by"
            placeholder="Кем выдан"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="issued_date">Дата выдачи</label>
            <MyInput
              id="issued_date"
              type="text"
              v-model="employeeData.passport.issued_date"
              placeholder="дд/мм/гггг"
            />
          </div>

          <div class="form-group half">
            <label for="division_code">Код подразделения</label>
            <MyInput
              id="division_code"
              type="text"
              v-model="employeeData.passport.division_code"
              placeholder="000-000"
            />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Адрес проживания</h3>
        <div class="form-row">
          <div class="form-group half">
            <label for="region">Регион</label>
            <MyInput
              id="region"
              type="text"
              v-model="employeeData.address.region"
              placeholder="Введите регион"
            />
          </div>

          <div class="form-group half">
            <label for="locality">Населенный пункт</label>
            <MyInput
              id="locality"
              type="text"
              v-model="employeeData.address.locality"
              placeholder="Введите населенный пункт"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="street">Улица</label>
          <MyInput
            id="street"
            type="text"
            v-model="employeeData.address.street"
            placeholder="Введите улицу"
          />
        </div>

        <div class="form-row">
          <div class="form-group third">
            <label for="house">Дом</label>
            <MyInput
              id="house"
              type="text"
              v-model="employeeData.address.house"
              placeholder="Дом"
            />
          </div>

          <div class="form-group third">
            <label for="building">Корпус</label>
            <MyInput
              id="building"
              type="text"
              v-model="employeeData.address.building"
              placeholder="Корпус"
            />
          </div>

          <div class="form-group third">
            <label for="apartment">Квартира</label>
            <MyInput
              id="apartment"
              type="text"
              v-model="employeeData.address.apartment"
              placeholder="Квартира"
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <MyButton type="submit" modifier="create" :disabled="isSubmitting">
          {{ isSubmitting ? 'Создание...' : 'Создать' }}
        </MyButton>
        <MyButton
          type="button"
          modifier="cancel"
          @click="cancel"
          :disabled="isSubmitting"
          >Отмена</MyButton
        >
      </div>
    </form>
  </div>
</template>

<script>
import { createEmployees, uploadEmployeeFiles } from '@/http/employeeAPI.js';
import MyInput from '@/components/UI/MyInput.vue';
import MyButton from '@/components/UI/MyButton.vue';

const EMPLOYEE_INITIAL_DATA = {
  first_name: '',
  last_name: '',
  middle_name: '',
  birth_date: '',
  passport: {
    series: '',
    number: '',
    issued_by: '',
    issued_date: '',
    division_code: '',
  },
  address: {
    region: '',
    locality: '',
    street: '',
    house: '',
    apartment: '',
    building: '',
  },
};

export default {
  components: { MyButton, MyInput },
  props: {
    cancel: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      employeeData: { ...EMPLOYEE_INITIAL_DATA },
      selectedFiles: [],
      createError: null,
      isSubmitting: false,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.selectedFiles = Array.from(event.target.files);
    },

    async createEmployee() {
      try {
        this.isSubmitting = true;
        this.createError = null;

        // Шаг 1: Создаем сотрудника, отправляя JSON данные
        const createdEmployee = await createEmployees(this.employeeData);

        // Шаг 2: Если есть файлы, загружаем их для созданного сотрудника
        if (this.selectedFiles.length > 0) {
          const formData = new FormData();

          // Добавляем все файлы в FormData
          this.selectedFiles.forEach((file) => {
            formData.append('files', file);
          });

          // Загружаем файлы для созданного сотрудника
          await uploadEmployeeFiles(createdEmployee.id, formData);
        }

        // Уведомляем родительский компонент об успешном создании
        this.$emit('created');

        // Сбрасываем форму
        this.employeeData = { ...EMPLOYEE_INITIAL_DATA };
        this.selectedFiles = [];
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          this.createError = error.response.data.errors[0].message;
        } else {
          this.createError = 'Произошла ошибка при создании сотрудника';
        }
        console.error('Ошибка при создании сотрудника:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// Variables
$primary-color: #792ec9;
$primary-light: $primary-color;
$primary-dark: $primary-color;
$text-color: #333;
$border-color: #ddd;
$error-color: #e74c3c;
$success-color: #2ecc71;
$background-color: #f9f9f9;
$white: #fff;

.selected-files {
  margin-top: 10px;
  font-size: 0.9em;

  ul {
    margin-top: 5px;
    padding-left: 20px;
  }
}

// Base styles
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: $white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.employee-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// Typography
.form-title {
  color: $primary-color;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
  border-bottom: 2px solid $primary-light;
  padding-bottom: 0.75rem;
}

.section-title {
  color: $primary-dark;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: 500;
  padding-left: 0.5rem;
  border-left: 3px solid $primary-color;
}

// Form sections
.form-section {
  background-color: $background-color;
  padding: 2rem;
  border-radius: 6px;
  border: 1px solid $border-color;
}

// Form groups
.form-group {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.half {
  flex: 1;
}

.third {
  flex: 1;
}

// Form elements
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: $text-color;
}

// Buttons
.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

// Error message
.error-message {
  background-color: rgba($error-color, 0.1);
  color: $error-color;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border-left: 3px solid $error-color;
}
</style>
