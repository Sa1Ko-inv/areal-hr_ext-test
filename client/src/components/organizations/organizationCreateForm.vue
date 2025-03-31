<template>
  <form @submit.prevent="create" class="organization-create-form">
    <h3>Создание организации</h3>

    <div class="form-group">
      <label>Название организации</label>
      <input v-model.number="name" type="text" class="form-input">
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>

    <div class="form-group">
      <label>Комментарий</label>
      <textarea v-model="comment"  class="form-textarea"></textarea>
    </div>

    <div class="form-actions">
      <button type="submit" class="form-button form-button--submit">Создать</button>
      <button type="button" @click="cancel" class="form-button form-button--cancel">Отмена</button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    cancel: {
      type: Function,
      required: true
    },
    error: { // Добавляем пропс для ошибки
      type: String,
      default: null
    }
  },
  data() {
    return {
      name: '',
      comment: ''
    }
  },
  methods: {
    create() {
      this.$emit('create', {
        name: this.name,
        comment: this.comment
      });
      this.name = '';
      this.comment = '';
    },

  }
}
</script>

<style lang="scss" scoped>
.error-message {
  color: #d32f2f;
  margin-top: 5px;
  font-size: 14px;
  font-weight: normal;
}
.organization-create-form {
  width: 600px;

  h3 {
    color: #792ec9;
    margin-bottom: 20px;
  }
}

.form-group {
  margin-bottom: 15px;
  color: #792ec9;
  font-weight: bold;
  font-size: 18px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
}

.form-input {
  width: 593px;
  padding: 8px 5px;
  border: 1px solid #792ec9;
  border-radius: 4px;
  font-size: 16px;
}

.form-textarea {
  width: 593px;
  padding: 8px 5px;
  height: 100px;
  border: 1px solid #792ec9;
  border-radius: 4px;
  font-size: 18px;
  font-family: Calibri;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;

  &--submit {
    background-color: #792ec9;
    color: white;
    border-color: #792ec9;

    &:hover {
      background-color: #792ec9
    }
  }

  &--cancel {
    background-color: transparent;
    color: #d32f2f;
    border-color: #d32f2f;

    &:hover {
      background-color: rgba(#d32f2f, 0.1);
    }
  }
}
</style>