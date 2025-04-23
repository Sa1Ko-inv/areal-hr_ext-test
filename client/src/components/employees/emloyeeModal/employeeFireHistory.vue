<template>
  <div class="fired-history-modal">
    <h4>История увольнений</h4>
    <button class="close-btn" @click="cancel" title="Закрыть">×</button>

    <div v-if="firedHistory.length === 0" class="no-data">
      Нет записей об уволенных сотрудниках.
    </div>

    <div v-else class="history-list">
      <table>
        <thead>
          <tr>
            <th>ID Сотрудника</th>
            <th>ФИО (на момент увольнения)</th>
            <th>Паспорт</th>
            <th>Адрес</th>
            <th>Дата увольнения</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in firedHistory" :key="entry.id">
            <td>{{ entry.object_id }}</td>
            <td>
              {{ entry.changed_fields?.last_name?.old || '' }}
              {{ entry.changed_fields?.first_name?.old || '' }}
              {{ entry.changed_fields?.middle_name?.old || '' }}
            </td>
            <td>
              {{ entry.changed_fields?.passport?.old || '' }}
              {{ entry.changed_fields?.passportSeries?.old || '' }}
              {{ entry.changed_fields?.passportNumber?.old || '' }}
            </td>
            <td>
              {{
                entry.changed_fields?.region?.old
                  ? 'Город ' + entry.changed_fields.region.old
                  : ''
              }}
              {{
                entry.changed_fields?.street?.old
                  ? 'Ул. ' + entry.changed_fields.street.old
                  : ''
              }}
              {{
                entry.changed_fields?.house?.old
                  ? 'д. ' + entry.changed_fields.house.old
                  : ''
              }}
              {{
                entry.changed_fields?.apartment?.old
                  ? 'кв. ' + entry.changed_fields.apartment.old
                  : ''
              }}
            </td>
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
import { fetchFiredHistory } from '@/http/employeeAPI.js';
import MyButton from '@/components/UI/MyButton.vue';
import MyPagination from '@/components/UI/MyPagination.vue'; // Или используйте fetch

export default {
  components: { MyPagination },
  props: {
    cancel: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      firedHistory: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    };
  },
  methods: {
    async getFiredHistory() {
      try {
        const response = await fetchFiredHistory(
          this.currentPage,
          this.pageSize
        );
        this.firedHistory = response.rows;
        this.totalItems = response.count;
      } catch (err) {
        console.error('Ошибка при загрузке истории уволенных:', err);
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
      this.getFiredHistory();
    },
  },
  mounted() {
    this.getFiredHistory();
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

.fired-history-modal {
  padding: 20px;
  min-width: 500px; // Примерная ширина
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
}

h4 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}

.loading-indicator,
.error-message,
.no-data {
  text-align: center;
  padding: 20px;
  color: grey;
}

.error-message {
  color: $danger-color;
}

.history-list {
  margin-top: 15px;
  max-height: 400px; // Ограничение высоты для прокрутки
  overflow-y: auto; // Добавить прокрутку, если список длинный
}

table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
}

.modal-actions {
  margin-top: 20px;
  text-align: right;
}

button {
  margin: 15px 5px 0;
  padding: 6px 12px;
  background-color: #f0f0f0;
  border: 1px solid $border-color;
  border-radius: $border-radius;
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
</style>
