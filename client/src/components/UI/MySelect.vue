<template>
  <select :value="modelValue" class="form-select" @change="changeOption">
    <option disabled value="">Выберите из списка</option>
    <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: "MySelect",

  props: {
    modelValue: {
      type: String,
      // required: true
    },
    options: {
      type: Array,
      // required: true,
      default: () => []
    }
  },
  methods: {
    changeOption(event) {
      this.$emit("update:modelValue", event.target.value);

    }
  }
}
</script>

<style lang="scss" scoped>

</style>