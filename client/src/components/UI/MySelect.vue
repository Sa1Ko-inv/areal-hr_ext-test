<template>
  <select :value="modelValue" class="form-select" @change="changeOption">
    <option disabled value="" v-if="placeholder">{{placeholder}}</option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value === null ? 'null' : option.value"
      :disabled="option.disabled">
      {{ option.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'MySelect',

  props: {
    modelValue: {
      type: String,
      // required: true
      default: '',
    },
    options: {
      type: Array,
      // required: true,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: ''
    },
  },
  methods: {
    changeOption(event) {
      const selectedValue = event.target.value;
      let parsedValue;

      if (selectedValue === 'null') {
        parsedValue = null;
      } else if (!isNaN(selectedValue)) {
        parsedValue = Number(selectedValue);
      } else {
        parsedValue = selectedValue;
      }

      this.$emit('update:modelValue', parsedValue);
    }

  },
};
</script>

<style lang="scss" scoped>
@use "@/styles/base" as *;
.form-select {
  width: 100%;
  padding: 10px 15px;
  font-size: $font-size-text;
  line-height: 1.5;
  color: $text-color-primary;
  background-color: $background-color-light;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23333' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 12px;
  border: 1px solid $border-color;
  border-radius: $border-radius;
  appearance: none;
  transition:
    border-color $transition-duration ease-in-out,
    box-shadow $transition-duration ease-in-out;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
  }

  &:disabled {
    background-color: #f5f5f5;
    color: $text-color-secondary;
    cursor: not-allowed;
  }

  option {
    padding: 8px;
    color: $text-color-primary;

    &[disabled] {
      color: $text-color-secondary;
    }
  }

  option:not([disabled]) {
    &:hover {
      background-color: rgba($primary-color, 0.1);
    }
  }
}
</style>
