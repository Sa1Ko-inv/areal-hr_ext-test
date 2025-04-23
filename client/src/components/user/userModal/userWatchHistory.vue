<template>
  <div class="history-modal">
    <div class="history-header">
      <h3>История пользователя</h3>
      <button class="close-btn" @click="cancel">×</button>
    </div>

    <div class="history-content">
      <div v-if="history.length === 0" class="no-history">
        Нет записей в истории
      </div>
      <div v-else class="history-list">
        <div v-for="(item, index) in history" :key="index" class="history-item">
          <div class="history-item-header">
            <div class="operation-info">
              <span class="operation-type" :class="getOperationClass(item.operation_type)">
                {{ getOperationName(item.operation_type) }}
              </span>
              <span class="changed-by">{{ item.changed_by }}</span>
            </div>
            <span class="history-date">{{formatDate(item.operation_date) }}</span>
          </div>
          <div class="history-item-content">
            <p><strong>Тип объекта:</strong> {{ item.object_type }}</p>
            <p><strong>ID объекта:</strong> {{ item.object_id }}</p>
            <div v-if="item.changed_fields" class="changes">
              <strong>Изменённые поля:</strong>
              <ul class="changed-fields-list">
                <li
                  v-for="(field, fieldName) in item.changed_fields"
                  :key="fieldName"
                  class="change-field"
                >
                  <div class="field-name">{{ getFieldName(fieldName) }}</div>
                  <div class="field-values">
                    <div
                      v-if="field.old !== null && field.old !== undefined"
                      class="old-value"
                    >
                      <span>Было:</span>
                      <div v-html="field.old"></div>
                    </div>
                    <div
                      v-if="field.new !== null && field.new !== undefined"
                      class="new-value"
                    >
                      <span>Стало:</span>
                      <div v-html="field.new"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Пагинация -->
  <MyPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @page-change="changePage"
  />
</template>

<script setup>
import { fetchUserHistory } from '@/http/userAPI.js';
import { computed, onMounted, ref } from 'vue';
import MyPagination from '@/components/UI/MyPagination.vue';

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
  cancel: {
    type: Function,
    required: true,
  },
})

// Объявляем переменные
const history = ref([])
const currentPage = ref(1)
const pageSize = ref(3)
const totalItems = ref(0)

const getHistory = async () => {
  try {
    const response = await fetchUserHistory(props.userId, currentPage.value, pageSize.value);
    history.value = response.rows;
    totalItems.value = response.count;
  } catch (error) {
    console.error('Ошибка при получении истории:', error)
  }
}

// Формат даты для отображения
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
// Функция для получения названия операции
const getOperationName = (type) => {
  const operation = {
    create: 'Создание',
    update: 'Обновление',
    delete: 'Удаление',
  };
  return operation[type] || type;
}
const getOperationClass = (type) => {
  return `operation-${type}`;
}
// Функция для получения названия изменений
const getFieldName = (field) => {
  const fieldNames = {
    first_name: 'Имя',
    last_name: 'Фамилия',
    middle_name: 'Отчество',
    login: 'Логин',
    password: 'Пароль',
    role: 'Роль',
  };
  return fieldNames[field] || field;
}

// Функция для отображения страниц
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});
// Функция переключения страницы
const changePage = (page) => {
  currentPage.value = page;
  getHistory();
}
onMounted(getHistory);
</script>

<style lang="scss" scoped>
</style>