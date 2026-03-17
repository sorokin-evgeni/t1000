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

interface Props {
  name: string
  label?: string
  fieldId?: string
  hint?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
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
.field-input {
  display: block;
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #111827;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
  -moz-appearance: textfield;
}

.field-input::-webkit-outer-spin-button,
.field-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.field-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.field-input--error {
  border-color: #ef4444;
}

.field-input--error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.field-input--valid {
  border-color: #10b981;
}

.field-input--valid:focus {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

.field-input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.readonly-value {
  display: block;
  font-size: 14px;
  color: #111827;
  padding: 4px 0;
}
</style>
