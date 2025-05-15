<template>
  <div class="delete-history-modal">
    <h4>История удаления</h4>
    <MyButton style="background-color: white" modifier="cancel" class="close-btn" @click="cancel" title="Закрыть">×</MyButton>

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

  <!-- Пагинация -->
  <MyPagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @page-change="changePage"
  />
</template>

<script>
import { fethcDeletedPositions } from '@/http/positionAPI.js';
import MyButton from '@/components/UI/MyButton.vue';
import MyPagination from '@/components/UI/MyPagination.vue';
import { formatDate } from '@/utils/formatDate.js';

export default {
  components: { MyPagination, MyButton },
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
    formatDate,
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
</style>
