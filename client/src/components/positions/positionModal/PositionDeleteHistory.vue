<template>
  <div class="delete-history-modal">
    <h4>История удаления</h4>
    <MyButton class="close-btn" @click="cancel" title="Закрыть">×</MyButton>

    <div v-if="deleteHistory.length === 0" class="no-data">
      Нет записей об удаленных должностях.
    </div>

    <div class="history-list">
      <table>
        <thead>
          <tr>
            <th>ID Должности</th>
            <th>Название должности</th>
            <th>Дата удаления</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in deleteHistory" :key="entry.id">
            <td>{{ entry.object_id }}</td>
            <td>{{ entry.changed_fields?.name?.old || '' }}</td>
            <td>{{ formatDate(entry.operation_date) }}</td>
          </tr>
        </tbody>
      </table>
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
</template>

<script>
import { fethcDeletedPositions } from '@/http/positionAPI.js';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton },
  props: {
    cancel: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      deleteHistory: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
    };
  },

  methods: {
    async getDeletePosition() {
      try {
        const response = await fethcDeletedPositions(
          this.currentPage,
          this.pageSize
        );
        this.deleteHistory = response.rows;
        this.totalItems = response.count;
      } catch (error) {
        console.error('Ошибка при получении истории увольнений:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },
    changePage(page) {
      this.currentPage = page;
      this.getDeletePosition();
    },
  },
  mounted() {
    this.getDeletePosition();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/base";
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
  font-size: $font-size-title;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
  color: $text-color-secondary;

  &:hover {
    color: $text-color-primary;
  }
}

h4 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
  color: $text-color-primary;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: $text-color-secondary;
  font-style: italic;
}

.history-list {
  margin-top: 15px;
  max-height: 400px;
  overflow-y: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: $font-size-text;

    th,
    td {
      border: 1px solid #ddd;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: $background-color-light;
      font-weight: 600;
      position: sticky;
      top: 0;
    }

    tr:nth-child(even) {
      background-color: $background-color-light;
    }

    tr:hover {
      background-color: $background-color-light;
    }
  }
}

button {
  margin: 15px 5px 0;
  padding: 6px 12px;
  background-color: $background-color-light;
  border: 1px solid #ccc;
  border-radius: $border-radius;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: $background-color-light;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

span {
  margin: 0 10px;
  font-size: $font-size-text;
  color: $text-color-secondary;
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
      background-color: $background-color-light;
      border: none;
      border-radius: $border-radius;
      cursor: pointer;

      &:hover:not(:disabled) {
        background-color: $background-color-light;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .page-info {
      font-size: $font-size-text;
      color: $text-color-secondary;
    }
  }
}
</style>
