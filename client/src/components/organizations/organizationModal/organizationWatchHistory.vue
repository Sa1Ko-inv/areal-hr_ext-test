<template>
  <div class="history-modal">
    <div class="history-header">
      <h3>История организации</h3>
      <button class="close-btn" @click="cancel">×</button>
    </div>

    <div class="history-content">
      <div v-if="history.length === 0" class="no-history">
        Нет записей в истории
      </div>

      <div v-else class="history-list">
        <div v-for="item in history" class="history-item">
          <div class="history-item-header">
            <span class="operation-type">{{ getOperationName(item.operation_type) }}</span>
            <span class="history-date">{{ formatDate(item.operation_date) }}</span>
          </div>

          <div class="operation-type">
            <p><strong>Тип объекта:</strong> {{ item.object_type }}</p>

            <div v-if="item.changed_fields" class="changes">
              <strong>Измененные поля</strong>

              <ul class="changed-fields-list">
                <li v-for="field in item.changed_fields">
                  <div class="field-values">
                    <div v-if="field.old !== null && field.old !== undefined" class="old-value">
                      <span>Было:</span> {{ field.old }}
                    </div>
                    <div v-if="field.new !== null && field.new !== undefined" class="new-value">
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
import {fetchOrganizationHistory} from "@/http/organizationAPI.js";

export default {
  props: {
    organization: {
      type: Object,
      required: true
    },
    cancel: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      history: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    }
  },

  methods: {
    async fetchHistory() {
      try {
        const response = await fetchOrganizationHistory(this.organization.id, this.currentPage, this.pageSize);
        this.history = response.rows;
        this.totalItems = response.count;
      } catch (error) {
        console.error('Ошибка при получении истории:', error);
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchHistory();
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
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1;
    }
  },
  mounted() {
    this.fetchHistory();
  }
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
  background-color: #f9f9f9;

  h3 {
    margin: 0;
    font-size: 1.25rem;
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
    transition: color 0.2s;

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
    font-style: italic;
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;

  .operation-type {
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85rem;
    text-transform: capitalize;

    &.create {
      background-color: #e3f7e3;
      color: #2e7d32;
    }

    &.update {
      background-color: #e3f2fd;
      color: #1565c0;
    }
  }

  .history-date {
    font-size: 0.85rem;
    color: #666;
  }
}

.operation-type {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;

  p {
    margin: 0 0 12px 0;
    font-size: 0.95rem;

    strong {
      color: #444;
    }
  }
}

.changes {
  padding: 16px;
  padding-top: 0;

  strong {
    display: block;
    margin-bottom: 12px;
    color: #444;
    font-size: 0.95rem;
  }
}

.changed-fields-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-values {
  display: flex;
  flex-direction: column;
  gap: 8px;

  div {
    display: flex;
    align-items: flex-start;
    gap: 6px;
  }

  span {
    font-weight: 500;
    color: #666;
    font-size: 0.9rem;
    white-space: nowrap;
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
    min-width: 100px;

    &:hover:not(:disabled) {
      background-color: #e0e0e0;
      border-color: #ccc;
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

@media (max-width: 600px) {
  .history-modal {
    max-height: 90vh;
  }

  .history-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .pagination {
    flex-direction: column;
    gap: 8px;

    .pagination-btn {
      width: 100%;
    }
  }
}
</style>