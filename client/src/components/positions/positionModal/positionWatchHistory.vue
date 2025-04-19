<template>
  <div class="history-modal">
    <div class="history-header">
      <h3>История должности</h3>
      <MyButton class="close-btn" @click="close">×</MyButton>
    </div>

    <div class="history-content">
      <div v-if="history.length === 0" class="no-history">
        Нет данных о должности
      </div>

      <div v-else class="history-list">
        <div v-for="item in history" :key="item.id" class="history-item">
          <div class="history-item-header">
            <div class="operation-info">
              <span
                class="operation-type"
                :class="getOperationName(item.operation_type)"
              >
                {{ getOperationName(item.operation_type) }}
              </span>
              <span class="changed-by">{{ item.changed_by }}</span>
            </div>
            <span class="history-date">{{
              formatDate(item.operation_date)
            }}</span>
          </div>

          <div class="history-item-content">
            <p><strong>Тип объекта:</strong> {{ item.object_type }}</p>

            <div v-if="item.changed_fields" class="changes">
              <strong>Изменённые поля:</strong>
              <ul class="changed-fields-list">
                <li
                  v-for="field in item.changed_fields"
                  :key="field.field"
                  class="change-field"
                >
                  <div class="field-values">
                    <div
                      v-if="field.old !== null && field.old !== undefined"
                      class="old-value"
                    >
                      <span>Было:</span> {{ field.old }}
                    </div>
                    <div
                      v-if="field.new !== null && field.new !== undefined"
                      class="new-value"
                    >
                      <span>Стало:</span> {{ field.new }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="history-footer">
      <div class="pagination">
        <MyButton
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Предыдущая
        </MyButton>
        <span class="page-info"
          >Страница {{ currentPage }} из {{ totalPages || 1 }}</span
        >
        <MyButton
          class="pagination-btn"
          :disabled="currentPage === totalPages || totalPages === 0"
          @click="changePage(currentPage + 1)"
        >
          Следующая
        </MyButton>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPositionHistory } from '@/http/positionAPI.js';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton },
  props: {
    position: {
      type: Object,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      history: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
    };
  },

  methods: {
    async getHistoryPosition() {
      try {
        const response = await fetchPositionHistory(
          this.position.id,
          this.currentPage,
          this.pageSize
        );
        this.history = response.rows;
        this.totalItems = response.count;
      } catch (error) {
        console.error('Ошибка при получении истории должности:', error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.getHistoryPosition();
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    getOperationName(type) {
      const operations = {
        create: 'Создание',
        update: 'Обновление',
      };
      return operations[type] || type;
    },
  },

  mounted() {
    this.getHistoryPosition();
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1;
    },
  },
};
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

          &.operation-create {
            background-color: #e3f7e3;
            color: #2e7d32;
          }

          &.operation-update {
            background-color: #f2e8ff;
            color: #792ec9;
          }
        }

        .changed-by {
          font-size: 0.85rem;
          color: #555;
          background-color: #f0f0f0;
          padding: 3px 8px;
          border-radius: 12px;
        }
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
