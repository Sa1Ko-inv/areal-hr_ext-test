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
.delete-history-modal {
  padding: 20px;
  min-width: 500px;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
  color: #666;

  &:hover {
    color: #333;
  }
}

h4 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.history-list {
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    th,
    td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: #f5f5f5;
      font-weight: 600;
      position: sticky;
      top: 0;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #f0f0f0;
    }
  }
}

button {
  margin: 15px 5px 0;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

span {
  margin: 0 10px;
  font-size: 14px;
  color: #666;
}
</style>