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
              <span class="operation-type">
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
                      <div v-html="field.old, fieldName"></div>
                    </div>
                    <div
                      v-if="field.new !== null && field.new !== undefined"
                      class="new-value"
                    >
                      <span>Стало:</span>
                      <div v-html="field.new, fieldName"></div>
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

  <!--Пагинация-->
  <div class="history-footer">
    <div class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Предыдущая
      </button>
      <span class="page-info"
      >Страница {{ currentPage }} из {{ totalPages || 1 }}</span
      >
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages || totalPages === 0"
        @click="changePage(currentPage + 1)"
      >
        Следующая
      </button>
    </div>
  </div>
</template>

<script setup>
import { fetchUserHistory } from '@/http/userAPI.js';
import { computed, onMounted, ref } from 'vue';

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
.history-modal {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  width: 100%;
  max-width: 800px;
  overflow: hidden;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    &:hover {
      color: #333;
    }
  }
}

.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  .no-history {
    text-align: center;
    padding: 40px 0;
    color: #666;
  }
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .history-item {
    border: 1px solid #eee;
    border-radius: 6px;
    overflow: hidden;
    .history-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background-color: #f9f9f9;
      .operation-info {
        display: flex;
        align-items: center;
        gap: 12px;
        .operation-type {
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .changed-by {
          font-size: 0.85rem;
          color: #555;
          background-color: #f0f0f0;
          padding: 3px 8px;
          border-radius: 12px;
        }
      }
      .operation-create {
        background-color: #e3f7e3;
        color: #2e7d32;
      }
      .operation-update {
        background-color: #f2e8ff;
        color: #792ec9;
      }
      .operation-delete {
        background-color: #ffebee;
        color: #c62828;
      }
      .operation-hire {
        background-color: #e3f7e3;
        color: #2e7d32;
      }
      .operation-fire {
        background-color: #fbe9e7;
        color: #d84315;
      }
      .operation-department_change,
      .operation-salary_change {
        background-color: #fff8e1;
        color: #f57f17;
      }
      .history-date {
        font-size: 0.85rem;
        color: #666;
      }
    }
    .history-item-content {
      padding: 16px;
      p {
        margin: 5px 0;
      }
      .changes {
        margin-top: 10px;
        strong {
          display: block;
          margin-bottom: 8px;
        }
      }
      .changed-fields-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      .change-field {
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px dashed #eee;
        &:last-child {
          border-bottom: none;
        }
        .field-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .field-values {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-left: 12px;
          .old-value {
            color: #d32f2f;
            span {
              font-weight: 500;
            }
          }
          .new-value {
            color: #388e3c;
            span {
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}

.history-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    .pagination-btn {
      padding: 8px 16px;
      background-color: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      &:hover:not(:disabled) {
        background-color: #e0e0e0;
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
    .page-info {
      font-size: 0.9rem;
      color: #666;
    }
  }
}
</style>