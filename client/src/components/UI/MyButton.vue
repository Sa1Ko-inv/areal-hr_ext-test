<template>
  <button :class="['btn', modifierClass]" v-bind="$attrs">
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

<style lang="scss" scoped>
@import "@/styles/base";
.btn {
  padding: 8px 12px;
  border-radius: $border-radius;
  font-size: $font-size-text;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid $primary-color;
  background-color: transparent;
  color: $primary-color;
  margin: 0 5px;
  flex: 1;
}

.btn:hover {
  background-color: $primary-color-dark;
}

/* Для кнопки редактирования */
.btn--edit {
  background-color: $primary-color;
  color: white;
}

.btn--edit:hover {
  background-color: $primary-color-dark;
}

/* Для кнопки удаления */
.btn--delete {
  background-color: transparent;
  color: $danger-color;
  border-color: $danger-color;
}

.btn--delete:hover {
  background-color: rgba($danger-color, 0.1);
}

/* Для кнопки сохранения */
.btn--save {
  background-color: transparent;
  color: $primary-color;
  border-color: $primary-color;
}

.btn--save:hover {
  background-color: rgba($primary-color-dark, 0.1);
}

/* Для кнопки отмены */
.btn--cancel {
  background-color: transparent;
  color: $danger-color;
  border-color: $danger-color;
}

.btn--cancel:hover {
  background-color: rgba($danger-color, 0.1);
}

/* Для кнопки создания */
.btn--create {
  background-color: $primary-color;
  color: white;
}

.btn--create:hover {
  background-color: $primary-color-dark;
}

/* Для кнопки просмотра истории */
.btn--showHistory {
  background-color: white;
  color: $primary-color;
  border: 1px solid $primary-color;
}

.btn--showHistory:hover {
  background-color: rgba($primary-color-dark, 0.1);
}
</style>