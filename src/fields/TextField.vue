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
import type { DisableableFieldProps } from './fieldProps'

interface Props extends DisableableFieldProps {
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
@import './fieldInput.css';
</style>
