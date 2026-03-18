<template>
  <FieldWrapper
    :label="label"
    :field-id="fieldId"
    :error-message="displayError"
    :hint="hint"
    :required="required"
  >
    <span v-if="readonly" class="readonly-value">
      {{ value !== undefined && value !== null ? value : '—' }}
    </span>
    <input
      v-else
      :id="fieldId"
      type="number"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="minimum"
      :max="maximum"
      :step="isInteger ? 1 : 'any'"
      :aria-invalid="!!displayError"
      class="field-input"
      :class="{
        'field-input--error': !!displayError,
        'field-input--valid': meta.touched && meta.valid,
      }"
      @input="onInput"
      @blur="handleBlur"
    />
  </FieldWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'
import FieldWrapper from './FieldWrapper.vue'
import type { DisableableFieldProps } from './fieldProps'

interface Props extends DisableableFieldProps {
  placeholder?: string
  minimum?: number
  maximum?: number
  isInteger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  hint: undefined,
  required: false,
  readonly: false,
  disabled: false,
  placeholder: undefined,
  minimum: undefined,
  maximum: undefined,
  isInteger: false,
})

const { value, errorMessage, handleChange, handleBlur, meta } = useField<number | undefined>(
  () => props.name,
)

const displayError = computed(() => (meta.touched ? errorMessage.value : undefined))

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.value === '') {
    handleChange(undefined)
  } else {
    const num = props.isInteger ? parseInt(target.value, 10) : parseFloat(target.value)
    handleChange(isNaN(num) ? undefined : num)
  }
}
</script>

<style scoped>
@import './fieldInput.css';

.field-input {
  -moz-appearance: textfield;
}

.field-input::-webkit-outer-spin-button,
.field-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
