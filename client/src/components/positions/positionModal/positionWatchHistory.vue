<template>
  <div class="history-modal">
    <div class="history-header">
      <h3>История должности</h3>
      <div>
        <MyButton style="background-color: white" modifier="cancel" class="close-btn" @click="close">×</MyButton>
      </div>
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

    <!-- Пагинация -->
    <MyPagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="changePage"
    />
  </div>
</template>

<script>
import { fetchPositionHistory } from '@/http/positionAPI.js';
import MyPagination from '@/components/UI/MyPagination.vue';
import { formatDate } from '@/utils/formatDate.js';
import { getOperationClass, getOperationName } from '@/utils/operationNameAndClass.js';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton, MyPagination },
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
    formatDate,
    getOperationName,
    getOperationClass,
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

<style lang="scss" scoped >
</style>
