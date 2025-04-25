<template>
  <div class="file-manager">
    <div class="file-header">
      <h3>Файлы сотрудника</h3>
      <div>
        <MyButton style="background-color: white" modifier="cancel" class="close-btn" @click="cancel">×</MyButton>
      </div>
    </div>

    <!-- Секция загрузки файлов -->
    <div class="upload-section">
      <h4>Загрузить новые файлы</h4>
      <div class="file-input-wrapper">
        <label for="file-upload" class="file-upload-label">
          Выбрать файлы
        </label>
        <input
          type="file"
          id="file-upload"
          multiple
          @change="handleFileSelect"
          class="file-input"
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        />
        <span v-if="selectedFiles.length > 0" class="selected-files-count">
          Выбрано файлов: {{ selectedFiles.length }}
        </span>
      </div>

      <!-- Список выбранных файлов -->
      <div v-if="selectedFiles.length > 0" class="selected-files-list">
        <div
          v-for="(file, index) in selectedFiles"
          :key="index"
          class="selected-file-item"
        >
          <span class="file-name">{{ file.name }}</span>
          <MyButton @click="removeSelectedFile(index)" class="remove-file-btn"
          >×
          </MyButton
          >
        </div>
      </div>

      <!-- Кнопка загрузки -->
      <MyButton
        modifier="save"
        @click="uploadFiles"
        :disabled="selectedFiles.length === 0 || isUploading"
      >
        {{ isUploading ? 'Загрузка...' : 'Загрузить файлы' }}
      </MyButton>

      <!-- Сообщение об ошибке -->
      <div v-if="uploadError" class="upload-error">
        {{ uploadError }}
      </div>
    </div>

    <!-- Секция просмотра файлов -->
    <div class="files-section">
      <h4>Существующие файлы</h4>

      <div v-if="isLoading" class="loading-message">Загрузка файлов...</div>

      <div
        v-else-if="!employee.files || employee.files.length === 0"
        class="no-files-message"
      >
        У сотрудника нет загруженных файлов
      </div>

      <div v-else class="files-grid">
        <div v-for="file in employee.files" :key="file.id" class="file-card">
          <div class="file-preview">
            <!-- Для изображений показываем превью -->
            <img
              v-if="isImageFile(file.name)"
              :src="getImageUrl(file.file_url)"
              :alt="file.name"
              class="file-thumbnail"
            />
            <!-- Для других типов файлов показываем иконку -->
            <div v-else class="file-icon">
              <span class="file-extension">{{
                  getFileExtension(file.name)
                }}</span>
            </div>
          </div>

          <div class="file-info">
            <div class="file-name" :title="file.name">{{ file.name }}</div>
            <div class="file-date">{{ formatDate(file.createdAt) }}</div>
          </div>

          <div class="file-actions">
            <a
              :href="getImageUrl(file.file_url)"
              target="_blank"
              class="view-btn"
              title="Открыть файл"
            >
              Открыть
            </a>
            <MyButton
              modifier="delete"
              @click="confirmDeleteFile(file)"
              title="Удалить файл"
            >
              Удалить
            </MyButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteConfirm" class="delete-confirm-modal">
      <div class="delete-confirm-content">
        <h4>Подтверждение удаления</h4>
        <p>Вы действительно хотите удалить файл "{{ fileToDelete?.name }}"?</p>
        <div class="delete-confirm-actions">
          <MyButton modifier="delete" @click="deleteFile">Удалить</MyButton>
          <MyButton modifier="cansel" @click="cancelDelete">Отмена</MyButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadEmployeeFiles, deleteEmployeeFile } from '@/http/employeeAPI.js';
import MyButton from '@/components/UI/MyButton.vue';

export default {
  components: { MyButton },
  props: {
    employee: {
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
      selectedFiles: [],
      isUploading: false,
      isLoading: false,
      uploadError: null,
      showDeleteConfirm: false,
      fileToDelete: null,
      localFiles: [], // Добавляем локальную копию файлов
    };
  },
  created() {
    // Инициализируем локальную копию файлов при создании компонента
    this.localFiles = this.employee.files ? [...this.employee.files] : [];
  },
  methods: {
    // Получение URL изображения
    getImageUrl(fileName) {
      return `http://localhost:5000/${fileName}`;
    },

    // Проверка, является ли файл изображением
    isImageFile(fileName) {
      const ext = this.getFileExtension(fileName).toLowerCase();
      return ['jpg', 'jpeg', 'png'].includes(ext);
    },

    // Получение расширения файла
    getFileExtension(fileName) {
      return fileName.split('.').pop() || '';
    },

    // Форматирование даты
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },

    // Обработка выбора файлов
    handleFileSelect(event) {
      const newFiles = Array.from(event.target.files);

      // Проверка типов файлов (опционально)
      const validFiles = newFiles.filter((file) => {
        const fileType = file.type.toLowerCase();
        return fileType.includes('image/');
      });

      if (validFiles.length !== newFiles.length) {
        this.uploadError =
          'Некоторые файлы имеют неподдерживаемый формат и были пропущены';
      } else {
        this.uploadError = null;
      }

      this.selectedFiles = [...this.selectedFiles, ...validFiles];

      // Сбрасываем input, чтобы можно было выбрать те же файлы повторно
      event.target.value = '';
    },

    // Удаление файла из списка выбранных
    removeSelectedFile(index) {
      this.selectedFiles.splice(index, 1);
    },

    // Загрузка файлов на сервер
    async uploadFiles() {
      if (this.selectedFiles.length === 0) return;

      this.isUploading = true;
      this.uploadError = null;

      try {
        const formData = new FormData();
        this.selectedFiles.forEach((file) => {
          formData.append('files', file);
        });

        const response = await uploadEmployeeFiles(this.employee.id, formData);

        // Добавляем новые файлы в локальную копию
        if (response.data && response.data.files) {
          this.localFiles = [...this.localFiles, ...response.data.files];
        }

        // Очищаем список выбранных файлов
        this.selectedFiles = [];

        // Уведомляем родительский компонент об успешной загрузке
        this.$emit('files-uploaded', response.data.files);
      } catch (error) {
        console.error('Ошибка при загрузке файлов:', error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          this.uploadError = error.response.data.error;
        } else {
          this.uploadError = 'Произошла ошибка при загрузке файлов';
        }
      } finally {
        this.isUploading = false;
      }
    },

    // Подтверждение удаления файла
    confirmDeleteFile(file) {
      this.fileToDelete = file;
      this.showDeleteConfirm = true;
    },

    // Отмена удаления файла
    cancelDelete() {
      this.fileToDelete = null;
      this.showDeleteConfirm = false;
    },

    // Удаление файла
    async deleteFile() {
      if (!this.fileToDelete) return;

      try {
        await deleteEmployeeFile(this.fileToDelete.id);

        // Удаляем файл из локальной копии
        this.localFiles = this.localFiles.filter(
          (file) => file.id !== this.fileToDelete.id,
        );

        // Уведомляем родительский компонент об удалении файла
        this.$emit('file-deleted', this.fileToDelete.id);
      } catch (error) {
        console.error('Ошибка при удалении файла:', error);
        alert('Не удалось удалить файл. Пожалуйста, попробуйте снова.');
      } finally {
        this.showDeleteConfirm = false;
        this.fileToDelete = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/base";

.file-manager {
  padding: 20px;
  background-color: $background-color-light;
  border-radius: $border-radius;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.file-header h3 {
  margin: 0;
  font-size: $font-size-title;
  color: $text-color-primary;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #777;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: $text-color-primary;
}

h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: $text-color-secondary;
  font-size: $font-size-title;
}

.upload-section,
.files-section {
  background-color: $background-color-light;
  border-radius: $border-radius;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: $box-shadow;
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.file-input {
  display: none;
}

.file-upload-label {
  display: inline-block;
  padding: 8px 16px;
  background-color: $primary-color;
  color: $background-color-light;
  border-radius: $border-radius;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-upload-label:hover {
  background-color: $primary-color;
}

.selected-files-count {
  margin-left: 15px;
  font-size: 14px;
  color: $text-color-secondary;
}

.selected-files-list {
  margin-bottom: 15px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: $border-radius;
  padding: 5px;
}

.selected-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.selected-file-item:last-child {
  border-bottom: none;
}

.remove-file-btn {
  background: none;
  border: none;
  color: $danger-color;
  cursor: pointer;
  font-size: $font-size-text;
  padding: 0 5px;
}

.upload-error {
  margin-top: 10px;
  color: $danger-color;
  font-size: $font-size-text;
}

.loading-message,
.no-files-message {
  padding: 20px;
  text-align: center;
  color: $text-color-secondary;
  font-style: italic;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.file-card {
  border: 1px solid #e0e0e0;
  border-radius: $border-radius;
  overflow: hidden;
  background-color: $background-color-light;
  transition: transform 0.2s,
  box-shadow 0.2s;
}

.file-card:hover {
  transform: translateY(-3px);
  box-shadow: $box-shadow;
}

.file-preview {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $background-color-light;
  overflow: hidden;
}

.file-thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.file-icon {
  width: 60px;
  height: 80px;
  background-color: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius;
  position: relative;
}

.file-extension {
  font-size: $font-size-text;
  text-transform: uppercase;
  font-weight: bold;
  color: $text-color-secondary;
}

.file-info {
  padding: 10px;
}

.file-name {
  font-size: $font-size-text;
  font-weight: 500;
  margin-bottom: 5px;
  word-break: break-word;
}

.file-date {
  font-size: $font-size-text;
  color: $text-color-secondary;
}

.file-actions {
  display: flex;
  padding: 0 10px 10px;
  gap: 5px;
}

.view-btn {
  flex: 1;
  padding: 6px 0;
  font-size: $font-size-text;
  border-radius: $border-radius;
  cursor: pointer;
  text-align: center;
}

.view-btn {
  background-color: $primary-color;
  color: $background-color-light;
  text-decoration: none;
}

.view-btn:hover {
  background-color: $primary-color;
}

.delete-confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-confirm-content {
  background-color: $background-color-light;
  padding: 20px;
  border-radius: $border-radius;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.delete-confirm-content h4 {
  margin-top: 0;
  color: $text-color-primary;
}

.delete-confirm-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 600px) {
  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .file-preview {
    height: 100px;
  }
}
</style>
