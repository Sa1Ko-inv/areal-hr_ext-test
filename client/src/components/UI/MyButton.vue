<template>
  <button :class="['btn', modifierClass]" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'MyButton',
  props: {
    modifier: {
      type: String,
      default: '',
    },
  },
  computed: {
    modifierClass() {
      return this.modifier ? `btn--${this.modifier}` : '';
    },
  },
};
</script>

<style scoped>
.btn {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #792ec9;
  background-color: transparent;
  color: #792ec9;
  margin: 0 5px;
  flex: 1;
}

.btn:hover {
  background-color: rgba(#792ec9, 0.1);
}

/* Для кнопки редактирования */
.btn--edit {
  background-color: #792ec9;
  color: white;
}

/* Для кнопки удаления */
.btn--delete {
  background-color: transparent;
  color: #d32f2f;
  border-color: #d32f2f;
}

.btn--delete:hover {
  background-color: rgba(#d32f2f, 0.1);
}

/* Для кнопки сохранения */
.btn--save {
  background-color: transparent;
  color: #792ec9;
  border-color: #792ec9;
}

.btn--save:hover {
  background-color: rgba(#792ec9, 0.1);
}

/* Для кнопки отмены */
.btn--cancel {
  background-color: transparent;
  color: #d32f2f;
  border-color: #d32f2f;
}

.btn--cancel:hover {
  background-color: rgba(#d32f2f, 0.1);
}

/* Для кнопки создания */
.btn--create {
  background-color: #792ec9;
  color: white;
}

.btn--create:hover {
  background-color: #6525a7;
}

/* Для кнопки просмотра истории */
.btn--showHistory {
  background-color: white;
  color: #792ec9;
  border: 1px solid #792ec9;
}

.btn--showHistory:hover {
  background-color: rgba(121, 46, 201, 0.1);
}
</style>
