<template>
  <div class="employee">
    <div class="employee__info">
      <div class="employee__name">
        <strong>ФИО</strong>
        {{ employee.last_name }} {{ employee.first_name }} {{ employee.middle_name }}
      </div>
      <div class="employee__birth_date">
        <strong>Дата рождения</strong>
        {{ employee.birth_date }}
      </div>

      <!-- Добавляем блок с HR информацией -->
      <div class="employee__hr_info">
        <strong>Информация о работе</strong>
        <div v-if="hrInfo">
          <div v-if="hrInfo.status === 'hired'">
            <p><strong>Должность:</strong> {{ hrInfo.position || 'Не указана' }}</p>
            <p><strong>Отдел:</strong> {{ hrInfo.department || 'Не указан' }}</p>
            <p><strong>Зарплата:</strong> {{ hrInfo.salary }} руб.</p>
          </div>
          <div v-else-if="hrInfo.status === 'fired'">
            <p>Сотрудник уволен</p>
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
        <ul>
          <li>Серия: {{ employee.passport.series }}</li>
          <li>Номер: {{ employee.passport.number }}</li>
          <li>Кем выдан: {{ employee.passport.issued_by }}</li>
          <li>Дата выдачи: {{ employee.passport.division_code }}</li>
          <li>Код подразделения: {{ employee.passport.division_code }}</li>
        </ul>
      </div>
      <div class="employee__address">
        <strong>Адрес сотрудника</strong>
        <ul>
          <li>Регион: {{ employee.address.region}}</li>
          <li>Населенный пункт: {{ employee.address.locality }}</li>
          <li>Улица: {{ employee.address.street }}</li>
          <li>Дом: {{ employee.address.house }}</li>
          <li>Корпус: {{ employee.address.building }}</li>
          <li>Квартира: {{ employee.address.apartment }}</li>
        </ul>
      </div>
    </div>
    <div class="employee__btn">
      <button @click="showDialog">Просмотреть файлы сотрудника</button>
      <button v-if="hrInfo && hrInfo.status === 'hired'" @click="fireEmployee">Уволить</button>
      <button v-if="!hrInfo || hrInfo.status !== 'hired'" @click="showHireDialog">Принять на работу</button>
      <button>Редактировать</button>
      <button v-if="hrInfo && hrInfo.status === 'hired'" @click="showChangeSalaryDialog">Изменить зарплату</button>
      <button v-if="hrInfo && hrInfo.status === 'hired'" @click="showChangeDepartmentDialog">Изменить отдел</button>
    </div>
    <MyModalWindow v-model:show="dialogVisible">
      <WatchFileEmployee
          :employee="employee"
      />
    </MyModalWindow>
  </div>
</template>

<script setup>
import MyModalWindow from "@/components/UI/MyModalWindow.vue";
import WatchFileEmployee from "@/components/employees/watchFileEmloyee.vue";
import { ref, onMounted } from "vue";
import { fetchEmployeeHRInfo } from "@/http/employeeAPI.js";

const props = defineProps({
  employee: {
    type: Object,
    required: true
  },
});

const dialogVisible = ref(false);
const hrInfo = ref(null);

function showDialog() {
  dialogVisible.value = true;
}

// Функции для обработки кнопок (заглушки, нужно реализовать)
function showHireDialog() {
  // Логика для показа диалога найма
}

function fireEmployee() {
  // Логика для увольнения
}

function showChangeSalaryDialog() {
  // Логика для показа диалога изменения зарплаты
}

function showChangeDepartmentDialog() {
  // Логика для показа диалога изменения отдела
}

// Загружаем HR информацию при монтировании компонента
onMounted(async () => {
  try {
    hrInfo.value = await fetchEmployeeHRInfo(props.employee.id);
  } catch (error) {
    console.error('Ошибка при загрузке HR информации:', error);
  }
});
</script>

<style scoped lang="scss">
.employee__hr_info {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}
</style>
