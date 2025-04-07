<template>
  <div class="history-modal">
    <div class="history-header">
      <h3>История должности</h3>
      <button class="close-btn" @click="close">×</button>
    </div>

    <div class="history-list">
      <div v-if="history.length === 0" class="history-item">
        <p>Нет данных о должности</p>
      </div>

      <div v-for="item in history" :key="item.id" class="history-item">
        <div class="operation-type">
          <p><strong>Тип объекта:</strong> {{item.object_type}}</p>
          <p><strong>Изменения: </strong>{{formatDate(item.operation_date)}}</p>
          <span :class="item.operation_type">{{ getOperationName(item.operation_type) }}</span>
        </div>

        <div class="changes">

          <ul>
            <li v-for="field in item.changed_fields" class="change-field">
              <div class="field-values">
                <div v-if="field.old !== null && field.old !== undefined" class="old-value">
                  <span>Было:</span> {{field.old}}
                </div>
                <div v-if="field.new !== null && field.new !== undefined" class="new-value">
                  <span>Стало:</span> {{field.new}}
                </div>
              </div>

            </li>
          </ul>

        </div>
      </div>


    </div>

    <div class="history-footer">
      <div class="pagination">
        <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
        >
          Предыдущая
        </button>
        <span class="page-info">Страница {{ currentPage }} из {{ totalPages || 1 }}</span>
        <button
            class="pagination-btn"
            :disabled="currentPage === totalPages || totalPages === 0"
            @click="changePage(currentPage + 1)"
        >
          Следующая
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchPositionHistory} from "@/http/positionAPI.js";

export default {
  props: {
    position: {
      type: Object,
      required: true
    },
    close: {
      type: Function,
      required: true
    },
  },

  data() {
    return {
      history: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0
    }
  },

  methods: {
    async getHistoryPosition() {
      try {
        const response = await fetchPositionHistory(this.position.id, this.currentPage, this.pageSize);
        this.history = response.rows;
        this.totalItems = response.count;
        console.log(response.rows);
      } catch (error) {
        console.error("Ошибка при получении истории должности:", error);
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
        minute: '2-digit'
      });
    },
    getOperationName(type) {
      const operations = {
        'create': 'Создание',
        'update': 'Обновление',
      };
      return operations[type] || type;
    },
  },

  mounted() {
    this.getHistoryPosition()
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1;
    }
  },
}
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
  position: relative;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    line-height: 1;
    padding: 0 5px;

    &:hover {
      color: #333;
    }
  }
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  .no-data {
    text-align: center;
    padding: 40px 0;
    color: #666;
    font-style: italic;
  }
}

.history-item {
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
}

.operation-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;

  p {
    margin: 0;
    font-size: 0.9rem;
  }

  span {
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;

    &.create {
      background-color: #e3f7e3;
      color: #2e7d32;
    }

    &.update {
      background-color: #f2e8ff;
      color: #792ec9;
    }

    &.delete {
      background-color: #ffebee;
      color: #c62828;
    }
  }
}

.changes {
  padding: 16px;

  strong {
    display: block;
    margin-bottom: 12px;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}

.change-field {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.field-values {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;

  div {
    display: flex;
    gap: 6px;
  }

  span {
    font-weight: 500;
    color: #666;
  }

  .old-value {
    color: #d32f2f;
  }

  .new-value {
    color: #388e3c;
  }
}

.history-footer {
  padding: 16px 20px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;

  .pagination-btn {
    padding: 8px 16px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;

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
    min-width: 120px;
    text-align: center;
  }
}
</style>