<template>
  <div class="employee-card">
    <div class="employee-card__sections">
      <section class="employee-card__section">
        <h2 class="section__title">Личная информация</h2>
        <div class="section__content">
          <div class="info-item">
            <strong class="info-item__key">ФИО:</strong>
            <span class="info-item__value">
              {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }}</span>
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
                <span class="info-item__value">{{
                    hrInfo.position || 'Не указана'
                  }}</span>
              </div>
              <div class="info-item">
                <strong class="info-item__key">Отдел:</strong>
                <span class="info-item__value">{{
                    hrInfo.department || 'Не указан'
                  }}</span>
              </div>
              <div class="info-item">
                <strong class="info-item__key">Зарплата:</strong>
                <span class="info-item__value">{{ hrInfo.salary }} руб.</span>
              </div>
            </template>
            <template v-else-if="hrInfo.status === 'fired'">
              <div class="info-item info-item--status">
                <span class="info-item__value" style="color: red">Сотрудник уволен</span>
              </div>
              <div class="info-item">
                <strong class="info-item__key">Последняя должность:</strong>
                <span class="info-item__value">{{ hrInfo.position || 'Не указана' }}</span>
              </div>
              <div class="info-item">
                <strong class="info-item__key">Последний отдел:</strong>
                <span class="info-item__value">{{ hrInfo.department || 'Не указан' }}</span>
              </div>
              <div class="info-item">
                <strong class="info-item__key">Последняя зарплата:</strong>
                <span class="info-item__value">{{ hrInfo.salary }} руб.</span>
              </div>
            </template>
            <div v-else class="info-item info-item--status">
              <span class="info-item__value"
              >Сотрудник не принят на работу</span
              >
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
              <span class="info-item__value">{{
                  employee.passport.series
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Номер:</strong>
              <span class="info-item__value">{{
                  employee.passport.number
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Кем выдан:</strong>
              <span class="info-item__value">{{
                  employee.passport.issued_by
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Дата выдачи:</strong>
              <span class="info-item__value">{{
                  employee.passport.issued_date
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Код подразделения:</strong>
              <span class="info-item__value">{{
                  employee.passport.division_code
                }}</span>
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
              <span class="info-item__value">{{
                  employee.address.region
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Населенный пункт:</strong>
              <span class="info-item__value">{{
                  employee.address.locality
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Улица:</strong>
              <span class="info-item__value">{{
                  employee.address.street
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Дом:</strong>
              <span class="info-item__value">{{ employee.address.house }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Корпус:</strong>
              <span class="info-item__value">{{
                  employee.address.building || '-'
                }}</span>
            </div>
            <div class="info-item">
              <strong class="info-item__key">Квартира:</strong>
              <span class="info-item__value">{{
                  employee.address.apartment || '-'
                }}</span>
            </div>
          </div>
          <div v-else class="info-item info-item--status">
            <span class="info-item__value">Адрес отсутствует</span>
          </div>
        </div>
      </section>
    </div>
    <div class="employee-card__actions">
      <MyButton
        style="background-color: #28a745; color: white; border: #28a745"
        v-if="hrInfo && hrInfo.status === 'fired'"
        @click="showHireDialog"
      >
        Принять на работу
      </MyButton>
      <MyButton
        style="background-color: #28a745; color: white; border: #28a745"
        v-if="!hrInfo || hrInfo.status === 'not_hired'"
        @click="showHireDialog"
      >
        Принять на работу
      </MyButton>
      <MyButton
        modifier="edit"
        v-if="hrInfo && hrInfo.status === 'hired'"
        @click="showChangeSalaryDialog"
      >
        Изменить зарплату
      </MyButton>
      <MyButton
        modifier="edit"
        v-if="hrInfo && hrInfo.status === 'hired'"
        @click="showChangeDepartmentDialog"
      >
        Изменить отдел
      </MyButton>
      <MyButton modifier="edit" @click="showEditDialog">Редактировать</MyButton>
      <MyButton modifier="showHistory" @click="showFilesDialog">Просмотреть файлы</MyButton>
      <MyButton modifier="showHistory" @click="showHistoryDialog">История</MyButton>
      <MyButton
        modifier="delete"
        v-if="hrInfo && hrInfo.status === 'hired'"
        @click="fire_Employee"
      >
        Уволить
      </MyButton>
    </div>

    <!--Модальное окно просмотра файлов сотрудника-->
    <MyModalWindow v-model:show="dialogVisibleFiles">
      <WatchFileEmployee
        :employee="employee"
        :cancel="cancelModal"
        @files-uploaded="handleFilesUploaded"
        @file-deleted="handleFileDeleted"
      />
    </MyModalWindow>

    <!-- Модальное окно для изменения отдела HR_Operation -->
    <MyModalWindow v-model:show="dialogVisibleDepartment">
      <EmployeeEditDepartment
        :employeeId="employee.id"
        :currentDepartmentId="hrInfo?.department_id"
        @updateDepartment="onDepartmentChangeSuccess"
        :cancel="cancelModal"
      />
    </MyModalWindow>

    <!-- Модальное окно для изменения зарплаты HR_Operation -->
    <MyModalWindow v-model:show="dialogVisibleSalary">
      <EmployeeEditSalary
        :employeeId="employee.id"
        :currentSalary="hrInfo?.salary"
        @updateSalary="onSalaryChangeSuccess"
        :cancel="cancelModal"
      />
    </MyModalWindow>

    <!-- Модальное окно для принятия на работу HR_Operation -->
    <MyModalWindow v-model:show="dialogVisibleHire">
      <EmployeeHire
        :employeeId="employee.id"
        :hireError="hireError"
        :cancel="cancelModal"
        @hireEmployee="handleHireEmployee"
      />
    </MyModalWindow>

    <!-- Модальное окно для просмотра истории сотрудника -->
    <MyModalWindow v-model:show="dialogVisibleHistory">
      <EmployeeWatchHistory :employeeId="employee.id" :cancel="cancelModal" />
    </MyModalWindow>

    <!-- Модальное окно для редактирования сотрудника -->
    <MyModalWindow v-model:show="dialogVisibleEdit">
      <EmployeeEdit
        :employee="employee"
        :cancel="cancelEdit"
        @employee-updated="handleEmployeeUpdated"
      />
    </MyModalWindow>
  </div>
</template>

<script>
// Импорты компонентов и API
import MyModalWindow from '@/components/UI/MyModalWindow.vue';
import WatchFileEmployee from '@/components/employees/emloyeeModal/watchFileEmloyee.vue';
import EmployeeEditDepartment from '@/components/employees/emloyeeModal/employeeEditDepartment.vue';
import {
  fetchEmployeeHRInfo,
  fireEmployee,
  hireEmployee,
} from '@/http/employeeAPI.js';
import EmployeeEditSalary from '@/components/employees/emloyeeModal/employeeEditSalary.vue';
import EmployeeHire from '@/components/employees/emloyeeModal/employeeHire.vue';
import EmployeeWatchHistory from '@/components/employees/emloyeeModal/employeeWatchHistory.vue';
import EmployeeEdit from '@/components/employees/emloyeeModal/employeeEdit.vue';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  name: 'EmployeeDetailCard',
  components: {
    MyButton,
    EmployeeEdit,
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
      dialogVisibleEdit: false,
      hrInfo: null, // Инициализировано как null для лучшей обработки состояния загрузки
      localEmployee: { ...this.employee },
      hireError: {
        department_id: null,
        position_id: null,
        salary: null,
        general: null,
      },
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
      this.hireError = { department_id: null, position_id: null, salary: null, general: null, };
      this.dialogVisibleHire = true;
    },
    showChangeSalaryDialog() {
      this.dialogVisibleSalary = true;
    },
    showHistoryDialog() {
      this.dialogVisibleHistory = true;
    },
    showEditDialog() {
      this.dialogVisibleEdit = true;
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
      if (!confirm('Вы уверены, что хотите уволить сотрудника?')) {
        return;
      }
      try {
        await fireEmployee(this.employee.id);
        await this.loadHRInfo();
      } catch (error) {
        console.error('Ошибка при увольнении сотрудника:', error);
        alert('Произошла ошибка при увольнении сотрудника');
      }
    },
    // Принятие на работу
    async handleHireEmployee(hireEmployeeData) {
      try {
        this.hireError = { department_id: null, position_id: null, salary: null, general: null, };
        await hireEmployee(hireEmployeeData);
        await this.loadHRInfo();
        this.dialogVisibleHire = false;
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            if (err.field && Object.prototype.hasOwnProperty.call(this.hireError, err.field)) {
              this.hireError[err.field] = err.message;
            } else {
              this.hireError.general = err.message;
            }
          });
        }
      }
    },
    // Загрузка HR информации
    async loadHRInfo() {
      this.hrInfo = null; // Сброс перед загрузкой для отображения индикатора
      try {
        this.hrInfo = await fetchEmployeeHRInfo(this.employee.id);
      } catch (error) {
        console.error('Ошибка при загрузке HR информации:', error);
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
    // Закрытие модального окна редактирования
    cancelEdit() {
      this.dialogVisibleEdit = false;
    },
    // Обработка события загрузки файлов
    async handleFilesUploaded(newFiles) {
      // Обновляем локальные данные без запроса к серверу
      if (!this.localEmployee.files) {
        this.localEmployee.files = [];
      }
      this.localEmployee.files = [...this.localEmployee.files, ...newFiles];
      // Уведомляем родительский компонент об обновлении
      this.$emit('update', { ...this.localEmployee });
    },
    // Обработка события удаления файла
    async handleFileDeleted(fileId) {
      this.localEmployee.files = this.localEmployee.files.filter(
        (file) => file.id !== fileId,
      );
      // Уведомляем родительский компонент об обновлении
      this.$emit('update', { ...this.localEmployee });
    },
    handleEmployeeUpdated(updatedEmployee) {
      // Обновляем локальные данные
      Object.assign(this.employee, updatedEmployee);
      // Прокидываем событие выше с полным обновленным объектом
      this.$emit('update', { ...this.employee });
      this.dialogVisibleEdit = false;
    },
  },
  mounted() {
    this.loadHRInfo();
  },
};
</script>

<style scoped lang="scss">
@use "@/styles/base" as *;

$section-gap: 20px;
$item-gap: 12px;

.employee-card {
  max-width: 1300px;
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
      grid-template-columns: repeat(
        2,
          1fr
      ); // Две колонки на экранах шире 768px
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
    font-size: $font-size-title;
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
</style>
