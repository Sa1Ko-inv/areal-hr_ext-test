<template>
  <div class="history-modal">
    <div class="history-header">
      <h3>История организации</h3>
      <div>
        <MyButton style="background-color: white" modifier="cancel" class="close-btn" @click="cancel">×</MyButton>
      </div>
    </div>
    <div class="history-content">
      <div v-if="history.length === 0" class="no-history">
        Нет записей в истории
      </div>
      <div v-else class="history-list">
        <div v-for="item in history" :key="item" class="history-item">
          <div class="history-item-header">
            <div class="operation-info">
              <span
                class="operation-type"
                :class="getOperationClass(item.operation_type)"
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
              <strong>Измененные поля:</strong>
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
                      <span>Было:</span>
                      <div v-html="field.old"></div>
                    </div>
                    <div
                      v-if="field.new !== null && field.new !== undefined"
                      class="new-value"
                    >
                      <span>Стало:</span>
                      <div v-html="field.new"></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Пагинация -->
    <MyPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="changePage"
    />
  </div>
</template>

<script>
import { fetchOrganizationHistory } from '@/http/organizationAPI.js';
import MyPagination from '@/components/UI/MyPagination.vue';
import { formatDate } from '@/utils/formatDate.js';
import { getOperationClass, getOperationName } from '@/utils/operationNameAndClass.js';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton, MyPagination },
  props: {
    organization: {
      type: Object,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      history: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
    };
  },

  methods: {
    formatDate,
    getOperationName,
    getOperationClass,
    async fetchHistory() {
      try {
        const response = await fetchOrganizationHistory(
          this.organization.id,
          this.currentPage,
          this.pageSize
        );
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
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1;
    },
  },
  mounted() {
    this.fetchHistory();
  },
};
</script>

<style lang="scss" scoped >
</style>
