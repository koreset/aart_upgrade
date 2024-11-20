<template>
  <Datepicker
    v-model="selectedDate"
    minimum-view="month"
    maximum-view="year"
    format="yyyy-MM"
    class="custom-datepicker"
    input-class="custom-input"
    @input="updateDate"
  />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Datepicker from 'vuejs3-datepicker'

// Define props with TypeScript types
interface DatePickerProps {
  modelValue: Date | null
  format: string
}

const props = defineProps<DatePickerProps>()

const emits = defineEmits<{
  'update:modelValue': [Date | null]
}>()

const selectedDate = ref<Date | null>(props.modelValue)

const updateDate = (newDate: Date | null) => {
  selectedDate.value = newDate
  emits('update:modelValue', newDate)
}
</script>
<style scoped>
.vuejs3-datepicker__inputvalue {
  color: green !important;
  background-color: yellow !important;
}
.custom-datepicker {
  background-color: red;
  display: block;
  color: black;
  min-width: 300px !important;
  border: 3px solid black;
}

#calendar-div > div {
  background-color: yellow;
}

#calendar-div > div {
  display: block;
  min-width: 400px !important;
}
</style>
