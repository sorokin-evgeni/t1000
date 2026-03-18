<template>
  <FieldWrapper
    :label="label"
    :field-id="fieldId"
    :error-message="displayError"
    :hint="hint"
    :required="required"
  >
    <span v-if="readonly" class="readonly-value">{{ formattedReadonlyValue || '—' }}</span>
    <input
      v-else
      :id="fieldId"
      type="date"
      :value="value"
      :disabled="disabled"
      :min="min"
      :max="max"
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
import type { DisableableFieldProps } from './fieldProps'

interface Props extends DisableableFieldProps {
  min?: string
  max?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  hint: undefined,
  required: false,
  readonly: false,
  disabled: false,
  min: undefined,
  max: undefined,
})

const { value, errorMessage, handleChange, handleBlur, meta } = useField<string>(
  () => props.name,
)

const displayError = computed(() => (meta.touched ? errorMessage.value : undefined))

const formattedReadonlyValue = computed(() => {
  if (!value.value) return ''
  try {
    const date = new Date(value.value + 'T00:00:00')
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return value.value
  }
})
</script>

<style scoped>
@import './fieldInput.css';

.field-input {
  cursor: pointer;
}
</style>
