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
@import './fieldInput.css';

.field-input {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.field-input:disabled {
  resize: none;
}

.readonly-value {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
