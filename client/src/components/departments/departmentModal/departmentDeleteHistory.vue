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
          <td>{{ formatDate(entry.operation_date) }}</td>  <!-- Изменено здесь -->
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
import { formatDate } from '@/utils/formatDate.js';

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
    formatDate,
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
</style>