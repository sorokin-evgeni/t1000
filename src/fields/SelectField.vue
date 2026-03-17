<template>
  <FieldWrapper
    :label="label"
    :field-id="fieldId"
    :error-message="displayError"
    :hint="hint"
    :required="required"
  >
    <span v-if="readonly" class="readonly-value">{{ displayValue || '—' }}</span>
    <div v-else class="select-wrapper">
      <select
        :id="fieldId"
        :value="value"
        :disabled="disabled"
        :aria-invalid="!!displayError"
        class="field-select"
        :class="{
          'field-select--error': !!displayError,
          'field-select--placeholder': !value,
          'field-select--valid': meta.touched && meta.valid,
        }"
        @change="handleChange"
        @blur="handleBlur"
      >
        <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="select-arrow" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
  </FieldWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'
import FieldWrapper from './FieldWrapper.vue'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  name: string
  label?: string
  fieldId?: string
  hint?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  enumValues?: (string | number | boolean | null)[]
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  hint: undefined,
  required: false,
  readonly: false,
  disabled: false,
  placeholder: undefined,
  enumValues: undefined,
})

const { value, errorMessage, handleChange, handleBlur, meta } = useField<string>(
  () => props.name,
)

const displayError = computed(() => (meta.touched ? errorMessage.value : undefined))

const normalizedOptions = computed((): SelectOption[] => {
  if (!props.enumValues) return []
  return props.enumValues
    .filter(v => v !== null && v !== undefined)
    .map(v => {
      const str = String(v)
      return { value: str, label: str }
    })
})

const displayValue = computed(() => {
  if (!value.value) return ''
  const match = normalizedOptions.value.find(o => o.value === value.value)
  return match ? match.label : value.value
})
</script>

<style scoped>
.select-wrapper {
  position: relative;
  display: block;
}

.field-select {
  display: block;
  width: 100%;
  padding: 8px 36px 8px 12px;
  font-size: 14px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #111827;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
}

.field-select--placeholder {
  color: #9ca3af;
}

.field-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.field-select--error {
  border-color: #ef4444;
}

.field-select--error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.field-select--valid {
  border-color: #10b981;
}

.field-select--valid:focus {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.15);
}

.field-select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
  display: flex;
  align-items: center;
}

.readonly-value {
  display: block;
  font-size: 14px;
  color: #111827;
  padding: 4px 0;
}
</style>
