<template>
  <FieldWrapper
    :label="label"
    :field-id="fieldId"
    :error-message="displayError"
    :hint="hint"
    :required="required"
  >
    <span v-if="readonly" class="readonly-value">{{ value || '—' }}</span>
    <input
      v-else
      :id="fieldId"
      :value="value"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="!!displayError"
      class="field-input"
      :class="{
        'field-input--error': !!displayError,
        'field-input--valid': meta.touched && meta.valid,
      }"
      @input="handleChange"
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
  format?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  hint: undefined,
  required: false,
  readonly: false,
  disabled: false,
  placeholder: undefined,
  format: undefined,
})

const { value, errorMessage, handleChange, handleBlur, meta } = useField<string>(
  () => props.name,
)

const displayError = computed(() => (meta.touched ? errorMessage.value : undefined))

const inputType = computed(() => {
  if (props.format === 'email') return 'email'
  if (props.format === 'password') return 'password'
  if (props.format === 'url') return 'url'
  if (props.format === 'tel') return 'tel'
  return 'text'
})
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
