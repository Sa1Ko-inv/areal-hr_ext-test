<template>
  <div class="delete-history-modal">
    <h4>История увольнений</h4>
    <MyButton style="background-color: white" modifier="cancel" class="close-btn" @click="cancel" title="Закрыть">×</MyButton>

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
import MyPagination from '@/components/UI/MyPagination.vue';
import MyButton from '@/components/UI/MyButton.vue';
import { formatDate } from '@/utils/formatDate.js';

export default {
  components: { MyButton, MyPagination },
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
    formatDate,
    async getFiredHistory() {
      try {
        const response = await fetchFiredHistory(
          this.currentPage,
          this.pageSize
        );
        console.log(response);
        this.firedHistory = response.rows;
        this.totalItems = response.count;
      } catch (err) {
        console.error('Ошибка при загрузке истории уволенных:', err);
      }
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
</style>
