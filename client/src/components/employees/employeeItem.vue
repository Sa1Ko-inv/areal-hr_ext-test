<template>
  <div class="employee-card">
    <div class="employee-card__sections">
      <section class="employee-card__section">
        <h2 class="section__title">Личная информация</h2>
        <div class="section__content">
          <div class="info-item">
            <strong class="info-item__key">ФИО:</strong>
            <span class="info-item__value">{{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }}</span>
          </div>
          <div class="info-item">
            <strong class="info-item__key">Дата рождения:</strong>
            <span class="info-item__value">{{ employee.birth_date }}</span>
          </div>
        </div>
      </section>

      <section class="employee-card__section">
        <h2 class="section__title">Информация о работе</h2>
        <div class="section__content">
          <div v-if="hrInfo">
            <template v-if="hrInfo.status === 'hired'">
              <div class="info-item">
                <strong class="info-item__key">Должность:</strong>
                <span class="info-item__value">{{ hrInfo.position || 'Не указана' }}</span>
              </div>
              <div class="info-item">
                <strong class="info-item__key">Отдел:</strong>
                <span class="info-item__value">{{ hrInfo.department || 'Не указан' }}</span>
              </div>
              <div class="info-item">
                <strong class="info-item__key">Зарплата:</strong>
                <span class="info-item__value">{{ hrInfo.salary }} руб.</span>
              </div>
            </template>
            <div v-else class="info-item info-item--status">
              <span class="info-item__value">Сотрудник не принят на работу</span>
            </div>
          </div>
          <div v-else class="info-item info-item--status">
            <span class="info-item__value">Загрузка информации...</span>
          </div>
        </div>
      </section>

      <section class="employee-card__section">
        <h2 class="section__title">Данные паспорта</h2>
        <div class="section__content">
          <!-- Добавляем проверку на наличие passport -->
          <div v-if="employee.passport">
            <div class="info-item">
              <strong class="info-item__key">Серия:</strong>
              <span class="info-item__value">{{ employee.passport.series }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Номер:</strong>
              <span class="info-item__value">{{ employee.passport.number }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Кем выдан:</strong>
              <span class="info-item__value">{{ employee.passport.issued_by }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Дата выдачи:</strong>
              <span class="info-item__value">{{ employee.passport.issued_date }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Код подразделения:</strong>
              <span class="info-item__value">{{ employee.passport.division_code }}</span>
            </div>
          </div>
          <div v-else class="info-item info-item--status">
            <span class="info-item__value">Данные паспорта отсутствуют</span>
          </div>
        </div>
      </section>

      <section class="employee-card__section">
        <h2 class="section__title">Адрес сотрудника</h2>
        <div class="section__content">
          <!-- Добавляем проверку на наличие address -->
          <div v-if="employee.address">
            <div class="info-item">
              <strong class="info-item__key">Регион:</strong>
              <span class="info-item__value">{{ employee.address.region }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Населенный пункт:</strong>
              <span class="info-item__value">{{ employee.address.locality }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Улица:</strong>
              <span class="info-item__value">{{ employee.address.street }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Дом:</strong>
              <span class="info-item__value">{{ employee.address.house }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Корпус:</strong>
              <span class="info-item__value">{{ employee.address.building || '-' }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Квартира:</strong>
              <span class="info-item__value">{{ employee.address.apartment || '-' }}</span>
            </div>
          </div>
          <div v-else class="info-item info-item--status">
            <span class="info-item__value">Адрес отсутствует</span>
          </div>
        </div>
      </section>
    </div>

    <div class="employee-card__actions">
      <button class="action-button" @click="showFilesDialog">Просмотреть файлы</button>
      <button class="action-button action-button--danger" v-if="hrInfo && hrInfo.status === 'hired'"
              @click="fire_Employee">Уволить
      </button>
      <button class="action-button action-button--success" v-if="!hrInfo || hrInfo.status !== 'hired'"
              @click="showHireDialog">Принять на работу
      </button>
      <button class="action-button" v-if="hrInfo && hrInfo.status === 'hired'" @click="showChangeSalaryDialog">Изменить
        зарплату
      </button>
      <button class="action-button" v-if="hrInfo && hrInfo.status === 'hired'" @click="showChangeDepartmentDialog">
        Изменить отдел
      </button>
      <button class="action-button">Редактировать</button>
      <button class="action-button" @click="showHistoryDialog">История</button>
    </div>
<!--Модальное окно просмотра файлов сотрудника-->
    <MyModalWindow v-model:show="dialogVisibleFiles">
      <WatchFileEmployee
          :employee="employee"
          :cancel="cancelModal"
      />
    </MyModalWindow>

    <MyModalWindow v-model:show="dialogVisibleDepartment">
      <EmployeeEditDepartment
          :employeeId="employee.id"
          :currentDepartmentId="hrInfo?.department_id"
          @updateDepartment="onDepartmentChangeSuccess"
          :cancel="cancelModal"
      />
    </MyModalWindow>
    <MyModalWindow v-model:show="dialogVisibleSalary">
      <EmployeeEditSalary
          :employeeId="employee.id"
          :currentSalary="hrInfo?.salary"
          @updateSalary="onSalaryChangeSuccess"
          :cancel="cancelModal"
      />
    </MyModalWindow>
    <MyModalWindow v-model:show="dialogVisibleHire">
      <EmployeeHire
          :employeeId="employee.id"
          :cancel="cancelModal"
          @hireEmployee="handleHireEmployee"
      />
    </MyModalWindow>
    <MyModalWindow v-model:show="dialogVisibleHistory">
      <EmployeeWatchHistory
          :employeeId="employee.id"
          :cancel="cancelModal"
      />
    </MyModalWindow>
  </div>
</template>

<script>
// Импорты компонентов и API
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import WatchFileEmployee from "@/components/employees/emloyeeModal/watchFileEmloyee.vue";
import EmployeeEditDepartment from "@/components/employees/emloyeeModal/employeeEditDepartment.vue";
import {fetchEmployeeHRInfo, fireEmployee, hireEmployee} from "@/http/employeeAPI.js";
import EmployeeEditSalary from "@/components/employees/emloyeeModal/employeeEditSalary.vue";
import EmployeeHire from "@/components/employees/emloyeeModal/employeeHire.vue";
import EmployeeWatchHistory from "@/components/employees/emloyeeModal/employeeWatchHistory.vue";

export default {
  name: 'EmployeeDetailCard', // Добавлено имя компонента
  components: {
    EmployeeWatchHistory,
    EmployeeHire,
    EmployeeEditSalary,
    MyModalWindow,
    WatchFileEmployee,
    EmployeeEditDepartment,
  },
  props: {
    employee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisibleFiles: false,
      dialogVisibleDepartment: false,
      dialogVisibleHire: false,
      dialogVisibleSalary: false,
      dialogVisibleHistory: false,
      hrInfo: null, // Инициализировано как null для лучшей обработки состояния загрузки
    };
  },
  methods: {
    // Открытие модальных окон
    showFilesDialog() {
      this.dialogVisibleFiles = true;
    },
    showChangeDepartmentDialog() {
      this.dialogVisibleDepartment = true;
    },
    showHireDialog() {
      this.dialogVisibleHire = true;
    },
    showChangeSalaryDialog() {
      this.dialogVisibleSalary = true;
    },
    showHistoryDialog() {
      this.dialogVisibleHistory = true;
    },

    async onDepartmentChangeSuccess() {
      this.dialogVisibleDepartment = false;
      await this.loadHRInfo();
    },
    async onSalaryChangeSuccess() {
      this.dialogVisibleSalary = false;
      await this.loadHRInfo();
    },

    // Увольнение сотрудника
    async fire_Employee() {
      if (!confirm("Вы уверены, что хотите уволить сотрудника?")) {
        return;
      }
      try {
        await fireEmployee(this.employee.id);
        await this.loadHRInfo();
      } catch (error) {
        console.error("Ошибка при увольнении сотрудника:", error);
        alert("Произошла ошибка при увольнении сотрудника");
      }
    },

    // Принятие на работу
    async handleHireEmployee(hireEmployeeData) {
      try {
        await hireEmployee(hireEmployeeData);
        await this.loadHRInfo();
        this.dialogVisibleHire = false;
      } catch (error) {
        console.error("Ошибка при принятии на работу:", error);
      }
    },

    // Загрузка HR информации
    async loadHRInfo() {
      this.hrInfo = null; // Сброс перед загрузкой для отображения индикатора
      try {
        this.hrInfo = await fetchEmployeeHRInfo(this.employee.id);
      } catch (error) {
        console.error("Ошибка при загрузке HR информации:", error);
      }
    },

    // Закрытие модальных окон (универсальный метод)
    cancelModal() {
      this.dialogVisibleFiles = false;
      this.dialogVisibleDepartment = false;
      this.dialogVisibleSalary = false;
      this.dialogVisibleHire = false;
      this.dialogVisibleHistory = false;
    },
  },
  mounted() {
    this.loadHRInfo();
  },
};
</script>

<style scoped lang="scss">

$primary-color: #792ec9;
$primary-color-dark: #6525a7;
$primary-color-light: rgba(121, 46, 201, 0.1);
$border-color: #e0e0e0;
$text-color-primary: #333;
$text-color-secondary: #555;
$background-color-light: #fff;
$danger-color: #dc3545;
$danger-color-dark: #c82333;
$success-color: #28a745;
$success-color-dark: #218838;
$border-radius: 8px;
$box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
$font-family: 'Arial', sans-serif;
$section-gap: 20px;
$item-gap: 12px;
$button-padding: 10px 18px;
$button-gap: 10px;

.employee-card {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  font-family: $font-family;
  background-color: #f9f9f9;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  &__sections {
    display: grid;
    // Адаптивные колонки: одна на маленьких экранах, две на средних и больших
    grid-template-columns: 1fr;
    gap: $section-gap;
    margin-bottom: $section-gap * 1.5; // Больший отступ перед кнопками

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr); // Две колонки на экранах шире 768px
    }
  }

  &__section {
    background-color: $background-color-light;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    overflow: hidden;
    box-shadow: $box-shadow;
    display: flex;
    flex-direction: column;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: $button-gap;
    padding-top: $section-gap;
    border-top: 1px solid $border-color;
    margin-top: $section-gap;
  }
}

.section {
  &__title {
    background-color: $primary-color;
    color: white;
    padding: 12px 18px;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 600;
  }

  &__content {
    padding: 18px;
    flex-grow: 1;
  }
}

.info-item {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: $item-gap;
  padding-bottom: $item-gap;
  border-bottom: 1px solid #eee;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  &__key {
    flex: 0 0 160px;
    font-weight: 600;
    color: $text-color-secondary;
    margin-right: 10px;
    padding-top: 2px;
  }

  &__value {
    flex: 1 1 auto;
    color: $text-color-primary;
    word-break: break-word;
  }

  // Модификатор для статуса (Загрузка, Не принят)
  &--status {
    justify-content: center;
    font-style: italic;
    color: $text-color-secondary;
    border-bottom: none;
  }
}

.action-button {
  padding: $button-padding;
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

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  // Модификаторы для разных типов кнопок
  &--danger {
    background-color: $danger-color;

    &:hover {
      background-color: $danger-color-dark;
    }
  }

  &--success {
    background-color: $success-color;

    &:hover {
      background-color: $success-color-dark;
    }
  }
}
</style>