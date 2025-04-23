<script setup>
import { computed, onMounted, ref } from 'vue';
import MyButton from '@/components/UI/MyButton.vue';
import { fetchDeletedUsers } from '@/http/userAPI.js';
import MyPagination from '@/components/UI/MyPagination.vue';

const props = defineProps({
  cancel: {
    type: Function,
    required: true,
  },
});

// Объявление переменных
const deleteHistory = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = ref(0);

// Функция получение истории удаленных пользователей
const getDeleteUser = async () => {
  try {
    const response = await fetchDeletedUsers(currentPage.value, pageSize.value)
    deleteHistory.value = response.rows;
    totalItems.value = response.count;
  } catch (error) {
    console.error('Ошибка при получении истории удаленных пользователей:', error);
  }
}

// Функция форматирования даты
const formatDate = (dateString) => {
  if(!dateString) {
    return 'N/A';
  }
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};
// Функция для изменения страницы
const changePage = (page) => {
  currentPage.value = page;
  getDeleteUser();
};
// Функция для получения данных при монтировании компонента
onMounted(() => {
  getDeleteUser();
});
// Функция для отображения страниц
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value);
});
</script>

<template>
  <div class="delete-history-modal">
    <h4>История удаления</h4>
    <MyButton class="close-btn" @click="props.cancel" title="Закрыть">×</MyButton>

    <div v-if="deleteHistory.length === 0" class="no-data">
      Нет записей об удаленных должностях.
    </div>

    <div class="history-list">
      <table>
        <thead>
        <tr>
          <th>ID Пользователя</th>
          <th>ФИО</th>
          <th>Login</th>
          <th>Роль</th>
          <th>Дата удаления</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="entry in deleteHistory" :key="entry.id">
          <td>{{ entry.object_id }}</td>
          <td>
            {{ entry.changed_fields?.last_name?.old || '' }}
            {{ entry.changed_fields?.first_name?.old || '' }}
            {{ entry.changed_fields?.middle_name?.old || '' }}
          </td>
          <td>{{ entry.changed_fields?.login?.old || '' }}</td>
          <td>{{ entry.changed_fields?.role?.old || '' }}</td>
          <td>{{ formatDate(entry.operation_date) }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Пагинация -->
  <MyPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @page-change="changePage"
  />
</template>

<style scoped lang="scss">
</style>