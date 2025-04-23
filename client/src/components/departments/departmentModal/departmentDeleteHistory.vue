<template>
  <div class="delete-history-modal">
    <h4>История удаления</h4>
    <MyButton class="close-btn" @click="cancel" title="Закрыть">×</MyButton>

    <div v-if="deleteHistory.length === 0" class="no-data">
      Нет записей об удаленных отделах.
    </div>

    <div class="history-list">
      <table>
        <thead>
        <tr>
          <th>ID отдела</th>
          <th>Название отдела</th>
          <th>Название организации</th>
          <th>Дата удаления</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="entry in deleteHistory" :key="entry.id">
          <td>{{ entry.object_id }}</td>
          <td>{{ entry.changed_fields?.name?.old || '' }}</td>
          <td>{{ entry.changed_fields?.organization?.old || '' }}</td>
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

<script>
import MyPagination from '@/components/UI/MyPagination.vue';
import MyButton from '@/components/UI/MyButton.vue';
import { fetchDeletedDepartments } from '@/http/departmentAPI.js';

export default {
  components: { MyButton, MyPagination },
  props: {
    cancel: {
      type: Function,
      required: true,
    },
    organizationName: {
      type: String,
      required: false,
      default: null,
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
    async getDeletedDepartments() {
      try {
        const response = await fetchDeletedDepartments(
          this.currentPage,
          this.pageSize
        );

        // Фильтрация по названию организации, если оно передано
        let filteredHistory = response.rows;
        if (this.organizationName) {
          filteredHistory = response.rows.filter(entry =>
            entry.changed_fields?.organization?.old === this.organizationName
          );
        }

        this.deleteHistory = filteredHistory;
        this.totalItems = filteredHistory.length; // Или response.count, если сервер поддерживает фильтрацию
      } catch (error) {
        console.error('Ошибка при получении истории удаления отделов:', error);
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
      this.getDeletedDepartments();
    },
  },
  mounted() {
    this.getDeletedDepartments();
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
</style>