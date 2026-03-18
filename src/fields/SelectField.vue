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
        class="field-input"
        :class="{
          'field-input--error': !!displayError,
          'field-input--placeholder': !value,
          'field-input--valid': meta.touched && meta.valid,
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
import type { DisableableFieldProps } from './fieldProps'

interface SelectOption {
  value: string
  label: string
}

interface Props extends DisableableFieldProps {
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
@import './fieldInput.css';

.select-wrapper {
  position: relative;
  display: block;
}

.field-input {
  padding: 8px 36px 8px 12px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.field-input--placeholder {
  color: #9ca3af;
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
</style>
