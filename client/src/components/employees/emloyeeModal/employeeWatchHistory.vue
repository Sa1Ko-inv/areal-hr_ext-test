<template>
  <div class="history-modal">
    <div class="history-header">
      <h3>История сотрудника</h3>
      <button class="close-btn" @click="cancel">×</button>
    </div>
    <div class="history-content">
      <div v-if="history.length === 0" class="no-history">
        Нет записей в истории
      </div>
      <div v-else class="history-list">
        <div v-for="(item, index) in history" :key="index" class="history-item">
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
            <p><strong>ID объекта:</strong> {{ item.object_id }}</p>
            <div v-if="item.changed_fields" class="changes">
              <strong>Изменённые поля:</strong>
              <ul class="changed-fields-list">
                <li
                  v-for="(field, fieldName) in item.changed_fields"
                  :key="fieldName"
                  class="change-field"
                >
                  <div class="field-name">{{ getFieldName(fieldName) }}</div>
                  <div class="field-values">
                    <div
                      v-if="field.old !== null && field.old !== undefined"
                      class="old-value"
                    >
                      <span>Было:</span>
                      <div v-html="formatValue(field.old, fieldName)"></div>
                    </div>
                    <div
                      v-if="field.new !== null && field.new !== undefined"
                      class="new-value"
                    >
                      <span>Стало:</span>
                      <div v-html="formatValue(field.new, fieldName)"></div>
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
import { fetchEmployeeHistory } from '@/http/employeeAPI.js';
import MyPagination from '@/components/UI/MyPagination.vue';

export default {
  components: { MyPagination },
  props: {
    employeeId: {
      type: [Number, String],
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
      pageSize: 5,
      totalItems: 0,
    };
  },
  methods: {
    async getHistory() {
      try {
        const response = await fetchEmployeeHistory(
          this.employeeId,
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
      this.getHistory();
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    getOperationName(type) {
      const operations = {
        create: 'Создание',
        update: 'Обновление',
        delete: 'Удаление',
        hire: 'Прием на работу',
        fire: 'Увольнение',
        department_change: 'Смена отдела',
        salary_change: 'Изменение зарплаты',
      };
      return operations[type] || type;
    },
    getOperationClass(type) {
      return `operation-${type}`;
    },
    getFieldName(field) {
      const fieldNames = {
        last_name: 'Фамилия',
        first_name: 'Имя',
        middle_name: 'Отчество',
        birth_date: 'Дата рождения',
        passport: 'Паспорт',
        address: 'Адрес',
        files: 'Файлы',
        department: 'Отдел',
        position: 'Должность',
        salary: 'Зарплата',
        hire_date: 'Дата приема',
        fire_date: 'Дата увольнения',
      };
      return fieldNames[field] || field;
    },
    formatValue(value, fieldName) {
      if (value === null || value === undefined) return 'Не указано';

      // Форматирование в зависимости от типа поля
      switch (fieldName) {
        case 'birth_date':
        case 'hire_date':
        case 'fire_date':
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
            const date = new Date(value);
            return date.toLocaleDateString('ru-RU');
          }
          break;

        case 'passport':
          if (typeof value === 'object') {
            const passportParts = [];
            if (value.series) passportParts.push(`Серия: ${value.series}`);
            if (value.number) passportParts.push(`Номер: ${value.number}`);
            if (value.issued_by)
              passportParts.push(`Кем выдан: ${value.issued_by}`);
            if (value.division_code)
              passportParts.push(`Код подразделения: ${value.division_code}`);
            if (value.issued_date)
              passportParts.push(`Дата выдачи: ${value.issued_date}`);
            return passportParts.join('<br>');
          }
          break;

        case 'address':
          if (typeof value === 'object') {
            const parts = [];
            if (value.region) parts.push(`Регион: ${value.region}`);
            if (value.locality)
              parts.push(`Населенный пункт: ${value.locality}`);
            if (value.street) parts.push(value.street);
            if (value.house) parts.push(`д. ${value.house}`);
            if (value.building) parts.push(`Корпус: ${value.building}`);
            if (value.apartment) parts.push(`кв. ${value.apartment}`);
            return parts.join(', ');
          }
          break;

        case 'files':
          if (Array.isArray(value)) {
            // Если это массив файлов
            return value
              .map((file) => {
                // Если файл - это объект с полем name, возвращаем имя файла
                if (typeof file === 'object' && file !== null) {
                  return file.name || 'Файл без имени';
                }
                // Иначе возвращаем сам файл (если это строка)
                return file;
              })
              .join(', ');
          }
          break;

        case 'salary':
          if (typeof value === 'number') {
            return new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            }).format(value);
          }
          break;
      }

      if (
        fieldName === 'files' &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        // Проверяем, похож ли объект на массив (ключи 0, 1, 2...)
        const keys = Object.keys(value);
        const isArrayLike = keys.every((key) => !isNaN(parseInt(key)));

        if (isArrayLike) {
          // Преобразуем объект в массив и извлекаем имена файлов
          return Object.values(value)
            .map((file) => {
              if (typeof file === 'object' && file !== null) {
                return file.name || 'Файл без имени';
              }
              return file;
            })
            .join(', ');
        }
      }

      // Общий случай для объектов
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Пытаемся извлечь осмысленное представление объекта
        if (Object.keys(value).length === 0) return 'Пусто';

        // Для паспорта
        if (value.series && value.number) {
          return `${value.series} ${value.number}`;
        }

        // Для адреса
        if (value.region || value.street) {
          const parts = [];
          if (value.region) parts.push(value.region);
          if (value.street) parts.push(value.street);
          if (value.house) parts.push(`д. ${value.house}`);
          if (value.apartment) parts.push(`кв. ${value.apartment}`);
          return parts.join(', ');
        }

        // Для других объектов
        const objValues = [];
        for (const [k, v] of Object.entries(value)) {
          if (v !== null && v !== undefined) {
            objValues.push(`${k}: ${v}`);
          }
        }
        return objValues.join(', ');
      }

      // Для массивов
      if (Array.isArray(value)) {
        return value.join(', ');
      }

      // Для всех остальных типов
      return String(value);
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.pageSize) || 1;
    },
  },
  mounted() {
    this.getHistory();
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/base";
.history-modal {
  background-color: $background-color-light;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
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
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: $text-color-secondary;
    &:hover {
      color: $text-color-primary;
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
    color: $text-color-secondary;
  }
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .history-item {
    border: 1px solid #eee;
    border-radius: $border-radius;
    overflow: hidden;
    .history-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      background-color: $background-color-light;
      .operation-info {
        display: flex;
        align-items: center;
        gap: 12px;
        .operation-type {
          font-weight: 600;
          padding: 4px 8px;
          border-radius: $border-radius;
          font-size: $font-size-text;
        }
        .changed-by {
          font-size: $font-size-text;
          color: $text-color-secondary;
          background-color: $background-color-light;
          padding: 3px 8px;
          border-radius: $border-radius;
        }
      }
      .operation-create {
        background-color: $background-color-light;
        color: $success-color;
      }
      .operation-update {
        background-color: $background-color-light;
        color: $primary-color;
      }
      .operation-delete {
        background-color: $background-color-light;
        color: $danger-color;
      }
      .operation-hire {
        background-color: $background-color-light;
        color: $success-color-dark;
      }
      .operation-fire {
        background-color: $danger-color-dark;
        color: $danger-color;
      }
      .operation-department_change,
      .operation-salary_change {
        background-color: #fff8e1;
        color: #f57f17;
      }
      .history-date {
        font-size: $font-size-text;
        color: $text-color-secondary;
      }
    }
    .history-item-content {
      padding: 16px;
      p {
        margin: 5px 0;
        font-size: $font-size-text;
      }
      .changes {
        margin-top: 10px;
        strong {
          display: block;
          margin-bottom: 8px;
        }
      }
      .changed-fields-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }
      .change-field {
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px dashed #eee;
        &:last-child {
          border-bottom: none;
        }
        .field-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        .field-values {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-left: 12px;
          .old-value {
            color: $danger-color;
            span {
              font-weight: 500;
            }
          }
          .new-value {
            color: $success-color-dark;
            span {
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}

</style>
