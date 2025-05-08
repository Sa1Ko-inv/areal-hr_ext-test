<template>
  <div class="form-container">
    <form @submit.prevent="createEmployee" class="employee-form">
      <h2 class="form-title">Создание сотрудника</h2>

      <div v-if="errors.general" class="error-message">{{ errors.general }}</div>

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
          <div v-if="errors.first_name" class="error-message">{{ errors.first_name }}</div>
        </div>

        <div class="form-group">
          <label for="last_name">Фамилия</label>
          <MyInput
            id="last_name"
            type="text"
            v-model="employeeData.last_name"
            placeholder="Введите фамилию"
          />
          <div v-if="errors.last_name" class="error-message">{{ errors.last_name }}</div>
        </div>

        <div class="form-group">
          <label for="middle_name">Отчество</label>
          <MyInput
            id="middle_name"
            type="text"
            v-model="employeeData.middle_name"
            placeholder="Введите отчество"
          />
          <div v-if="errors.middle_name" class="error-message">{{ errors.middle_name }}</div>
        </div>

        <div class="form-group">
          <label for="birth_date">Дата рождения</label>
          <el-date-picker
            v-model="employeeData.birth_date"
            type="date"
            placeholder="Выберите дату"
            format="DD/MM/YYYY"
            value-format="DD/MM/YYYY"
            :disabled="isSubmitting"
            style="width: 100%; height: 42px"
            size="large"
          />
          <div v-if="errors.birth_date" class="error-message">{{ errors.birth_date }}</div>
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
              v-mask="'####'"
            />
            <div v-if="errors.passport_series" class="error-message">{{ errors.passport_series }}</div>
          </div>

          <div class="form-group half">
            <label for="passport_number">Номер паспорта</label>
            <MyInput
              id="passport_number"
              type="text"
              v-model="employeeData.passport.number"
              placeholder="000000"
              v-mask="'######'"
            />
            <div v-if="errors.passport_number" class="error-message">{{ errors.passport_number }}</div>
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
          <div v-if="errors.passport_issued_by" class="error-message">{{ errors.passport_issued_by }}</div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="issued_date">Дата выдачи</label>
            <el-date-picker
              v-model="employeeData.passport.issued_date"
              type="date"
              placeholder="Выберите дату"
              format="DD/MM/YYYY"
              value-format="DD/MM/YYYY"
              :disabled="isSubmitting"
              style="width: 100%; height: 42px"
              size="large"
            />
            <div v-if="errors.passport_issued_date" class="error-message">{{ errors.passport_issued_date }}</div>
          </div>

          <div class="form-group half">
            <label for="division_code">Код подразделения</label>
            <MyInput
              id="division_code"
              type="text"
              v-model="employeeData.passport.division_code"
              placeholder="000-000"
              v-mask="'###-###'"
            />
            <div v-if="errors.passport_division_code" class="error-message">{{ errors.passport_division_code }}</div>
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
            <div v-if="errors.address_region" class="error-message">{{ errors.address_region }}</div>
          </div>

          <div class="form-group half">
            <label for="locality">Населенный пункт</label>
            <MyInput
              id="locality"
              type="text"
              v-model="employeeData.address.locality"
              placeholder="Введите населенный пункт"
            />
            <div v-if="errors.address_locality" class="error-message">{{ errors.address_locality }}</div>
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
          <div v-if="errors.address_street" class="error-message">{{ errors.address_street }}</div>
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
            <div v-if="errors.address_house" class="error-message">{{ errors.address_house }}</div>
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
            <div v-if="errors.address_apartment" class="error-message">{{ errors.address_apartment }}</div>
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
        >
          Отмена
        </MyButton
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
      employeeData: JSON.parse(JSON.stringify(EMPLOYEE_INITIAL_DATA)),
      selectedFiles: [],
      errors: {
        first_name: null,
        last_name: null,
        middle_name: null,
        birth_date: null,
        passport_series: null,
        passport_number: null,
        passport_issued_by: null,
        passport_issued_date: null,
        passport_division_code: null,
        address_region: null,
        address_locality: null,
        address_street: null,
        address_house: null,
        address_apartment: null,
        address_building: null,
        general: null, // для общих ошибок
      },
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
        this.errors = {
          first_name: null,
          last_name: null,
          middle_name: null,
          birth_date: null,

          passport_series: null,
          passport_number: null,
          passport_issued_by: null,
          passport_issued_date: null,
          passport_division_code: null,

          address_region: null,
          address_locality: null,
          address_street: null,
          address_house: null,
          address_apartment: null,
          address_building: null,
          general: null, // для общих ошибок
        };

        // Шаг 1: Создаем сотрудника, отправляя JSON данные
        console.log('Создание сотрудника с данными:', this.employeeData);
        const createdEmployee = await createEmployees(this.employeeData);

        // Шаг 2: Если есть файлы, загружаем их для созданного сотрудника
        if (this.selectedFiles.length > 0) {
          const formData = new FormData();

          // Добавляем все файлы в FormData
          this.selectedFiles.forEach((file) => {
            formData.append('files', file);
          });

          try {
            // Загружаем файлы для созданного сотрудника
            await uploadEmployeeFiles(createdEmployee.id, formData);
          } catch (uploadError) {
            if (uploadError.response?.status === 413) {
              this.errors.general = 'размер файла слишком большой. Максимальный размер файла 20 МБ';
            } else {
              this.errors.general = 'Ошибка при загрузке файлов';
            }
            return;
          }
        }

        // Уведомляем родительский компонент об успешном создании
        this.$emit('created');

        // Сбрасываем форму
        this.employeeData = { ...EMPLOYEE_INITIAL_DATA };
        this.selectedFiles = [];
      } catch (error) {
        if (error.response?.status === 413) {
          this.errors.general = 'Размер файлов слишком большой. Максимальный размер: 20MB';
        } else if (error.response?.data?.errors) {
          error.response.data.errors.forEach(err => {
            if (err.field && Object.prototype.hasOwnProperty.call(this.errors, err.field)) {
              this.errors[err.field] = err.message;
            } else {
              this.errors.general = err.message;
            }
          });
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
@import "@/styles/base";

.selected-files {
  margin-top: 10px;
  font-size: $font-size-text;

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
  background-color: $background-color-light;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}

.employee-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

// Typography
.form-title {
  color: $primary-color;
  font-size: $font-size-title;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
  border-bottom: 2px solid $primary-color;
  padding-bottom: 0.75rem;
}

.section-title {
  color: $primary-color-dark;
  font-size: $font-size-title;
  margin-bottom: 1.5rem;
  font-weight: 500;
  padding-left: 0.5rem;
  border-left: 3px solid $primary-color;
}

// Form sections
.form-section {
  background-color: $background-color-light;
  padding: 2rem;
  border-radius: 6px;
  border: 1px solid $border-color;
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


// Buttons
.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

// Form group adjustments
.form-group {
  position: relative;
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: $text-color-primary;
  }

  //.error-message {
  //  position: absolute;
  //  top: -18px;
  //  left: 0;
  //  margin: 0;
  //}
}

// For fields with errors
.has-error {
  .MyInput { // предполагая, что ваш компонент MyInput рендерит input элемент
    border-color: $danger-color;

    &:focus {
      box-shadow: 0 0 0 2px rgba($danger-color, 0.2);
    }
  }
}
</style>
