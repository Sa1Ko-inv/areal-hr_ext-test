<template>
  <div class="employee">
    <div class="employee__info">
      <div class="employee__personal">
        <div class="employee__name">
          <strong>ФИО</strong>
          {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }}
        </div>
        <div class="employee__birth_date">
          <strong>Дата рождения</strong>
          {{ employee.birth_date }}
        </div>
      </div>

      <!-- Блок с HR информацией -->
      <div class="employee__hr_info">
        <strong>Информация о работе</strong>
        <div v-if="hrInfo">
          <div v-if="hrInfo.status === 'hired'">
            <p><strong>Должность:</strong> {{ hrInfo.position || 'Не указана' }}</p>
            <p><strong>Отдел:</strong> {{ hrInfo.department || 'Не указан' }}</p>
            <p><strong>Зарплата:</strong> {{ hrInfo.salary }} руб.</p>
          </div>
          <div v-else>
            <p>Сотрудник не принят на работу</p>
          </div>
        </div>
        <div v-else>
          <p>Загрузка информации...</p>
        </div>
      </div>

      <div class="employee__passport">
        <strong>Данные паспорта</strong>

        <div>Серия: {{ employee.passport.series }}</div>
        <div>Номер: {{ employee.passport.number }}</div>
        <div>Кем выдан: {{ employee.passport.issued_by }}</div>
        <div>Дата выдачи: {{ employee.passport.division_code }}</div>
        <div>Код подразделения: {{ employee.passport.division_code }}</div>

      </div>

      <div class="employee__address">
        <strong>Адрес сотрудника</strong>
        <div>Регион: {{ employee.address.region }}</div>
        <div>Населенный пункт: {{ employee.address.locality }}</div>
        <div>Улица: {{ employee.address.street }}</div>
        <div>Дом: {{ employee.address.house }}</div>
        <div>Корпус: {{ employee.address.building }}</div>
        <div>Квартира: {{ employee.address.apartment }}</div>
      </div>
    </div>

    <div class="employee__btn">
      <button @click="showFilesDialog">Просмотреть файлы сотрудника</button>
      <button v-if="hrInfo && hrInfo.status === 'hired'" @click="fire_Employee">Уволить</button>
      <button v-if="!hrInfo || hrInfo.status !== 'hired'" @click="showHireDialog">Принять на работу</button>
      <button v-if="hrInfo && hrInfo.status === 'hired'" @click="showChangeSalaryDialog">Изменить зарплату</button>
      <button v-if="hrInfo && hrInfo.status === 'hired'" @click="showChangeDepartmentDialog">Изменить отдел</button>
      <button>Редактировать</button>
      <button>Просмотреть историю сотрудника</button>
    </div>
    <!--Модальное окно для просмотра файлов-->
    <MyModalWindow v-model:show="dialogVisibleFiles">
      <WatchFileEmployee :employee="employee"/>
    </MyModalWindow>
    <!--Модальное окно для редактирования отдела сотрудника-->
    <MyModalWindow v-model:show="dialogVisibleDepartment">
      <EmployeeEditDepartment
          :employeeId="employee.id"
          :currentDepartmentId="hrInfo?.department_id"
          @updateDepartment="onDepartmentChangeSuccess"
          :cancel="cancelEdit"
      />
    </MyModalWindow>
    <!--    Модальное окно для изменения зарплаты-->
    <MyModalWindow v-model:show="dialogVisibleSalary">
      <EmployeeEditSalary
          :employeeId="employee.id"
          :currentSalary="hrInfo?.salary"
          @updateSalary="onSalaryChangeSuccess"
          :cancel="cancelEdit"
      />
    </MyModalWindow>
  </div>
</template>

<script>
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import WatchFileEmployee from "@/components/employees/watchFileEmloyee.vue";
import EmployeeEditDepartment from "@/components/employees/employeeEditDepartment.vue";
import {fetchEmployeeHRInfo, fireEmployee} from "@/http/employeeAPI.js";
import EmployeeEditSalary from "@/components/employees/employeeEditSalary.vue";

export default {
  components: {
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
      hrInfo: null,
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

    async onDepartmentChangeSuccess() {
      this.dialogVisibleDepartment = false;
      await this.loadHRInfo();
    },

    async onSalaryChangeSuccess() {
      this.dialogVisibleSalary = false;
      await this.loadHRInfo();
    },

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
    async loadHRInfo() {
      try {
        this.hrInfo = await fetchEmployeeHRInfo(this.employee.id);
      } catch (error) {
        console.error("Ошибка при загрузке HR информации:", error);
      }
    },

    cancelEdit() {
      this.dialogVisibleDepartment = false;
    },
  },
  mounted() {
    this.loadHRInfo();
  },
};
</script>


<style scoped lang="scss">
.employee__personal {
  display: flex;
  flex-direction: column;
}

.employee__btn {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;

  button {
    padding: 8px 12px;
    background-color: #792ec9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #792ec9
    }

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }
}
</style>
