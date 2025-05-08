<template>
  <input
    :value="modelValue"
    @input="updateInput"
    :class="['input', sizeClass]"
    :type="type"
  />
</template>

<script>
export default {
  name: 'MyInput',
  props: {
    modelValue: [String, Number],
    type: {
      type: String,
      default: 'text',
    },
    size: {
      type: String,
      default: 'medium', // Доступные размеры: small, medium, large
    },
  },
  computed: {
    sizeClass() {
      return `input--${this.size}`;
    },
  },
  methods: {
    updateInput(event) {
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/styles/base" as *;

.input {
  font-family: $font-family;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: $border-radius;
  font-size: 14px;
  line-height: 1.5;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;

  &:focus {
    border-color: #792ec9;
    box-shadow: 0 0 0 2px rgba(121, 46, 201, 0.2);
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
}

/* Размеры для универсальности */
.input--small {
  padding: 6px 10px;
  font-size: 12px;
}

.input--medium {
  padding: 10px 12px;
  font-size: 14px;
}

.input--large {
  padding: 14px 16px;
  font-size: 16px;
}
</style>
