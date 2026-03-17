<template>
  <FieldWrapper
    :label="label"
    :field-id="fieldId"
    :error-message="displayError"
    :hint="hint"
    :required="required"
  >
    <span v-if="readonly" class="readonly-value">{{ value || '—' }}</span>
    <textarea
      v-else
      :id="fieldId"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :aria-invalid="!!displayError"
      class="field-textarea"
      :class="{
        'field-textarea--error': !!displayError,
        'field-textarea--valid': meta.touched && meta.valid,
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
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  hint: undefined,
  required: false,
  readonly: false,
  disabled: false,
  placeholder: undefined,
  rows: 4,
})

const { value, errorMessage, handleChange, handleBlur, meta } = useField<string>(
  () => props.name,
)

const displayError = computed(() => (meta.touched ? errorMessage.value : undefined))
</script>

<style scoped>
.field-textarea {
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
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
  line-height: 1.5;
}

.field-textarea:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.field-textarea--error {
  border-color: #ef4444;
}

.field-textarea--error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.field-textarea--valid {
  border-color: #10b981;
}

.field-textarea--valid:focus {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

.field-textarea:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  resize: none;
}

.readonly-value {
  display: block;
  font-size: 14px;
  color: #111827;
  padding: 4px 0;
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
