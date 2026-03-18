<template>
  <FieldWrapper
    :label="undefined"
    :field-id="fieldId"
    :error-message="displayError"
    :hint="hint"
    :required="required"
  >
    <div v-if="readonly" class="readonly-value">
      <span class="readonly-label">{{ label }}</span>
      <span class="readonly-badge" :class="value ? 'readonly-badge--yes' : 'readonly-badge--no'">
        {{ value ? 'Yes' : 'No' }}
      </span>
    </div>
    <label v-else class="checkbox-label" :for="fieldId">
      <input
        :id="fieldId"
        type="checkbox"
        :checked="value"
        :disabled="disabled"
        :aria-invalid="!!displayError"
        class="checkbox-input"
        :class="{ 'checkbox-input--error': !!displayError }"
        @change="handleChange(($event.target as HTMLInputElement).checked)"
        @blur="handleBlur"
      />
      <span
        class="checkbox-custom"
        :class="{ 'checkbox-custom--valid': meta.touched && meta.valid }"
      ></span>
      <span class="checkbox-text">{{ label }}</span>
    </label>
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
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  hint: undefined,
  required: false,
  readonly: false,
  disabled: false,
})

const { value, errorMessage, handleChange, handleBlur, meta } = useField<boolean>(
  () => props.name,
)

const displayError = computed(() => (meta.touched ? errorMessage.value : undefined))
</script>

<style scoped>
.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  font-family: system-ui, -apple-system, sans-serif;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.checkbox-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  min-width: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: #ffffff;
  transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background-color: #1a1a2e;
  border-color: #1a1a2e;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '';
  display: block;
  width: 5px;
  height: 9px;
  border: 2px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg) translate(-1px, -1px);
}

.checkbox-input:focus + .checkbox-custom {
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  border-color: #4f46e5;
}

.checkbox-input--error + .checkbox-custom {
  border-color: #ef4444;
}

.checkbox-custom--valid {
  border-color: #10b981;
}

.checkbox-input:checked + .checkbox-custom--valid {
  background-color: #10b981;
  border-color: #10b981;
}

.checkbox-input:disabled + .checkbox-custom {
  background-color: #f9fafb;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

.checkbox-text {
  line-height: 1.4;
}

.readonly-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.readonly-label {
  font-weight: 500;
}

.readonly-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.readonly-badge--yes {
  background-color: #dcfce7;
  color: #166534;
}

.readonly-badge--no {
  background-color: #f3f4f6;
  color: #6b7280;
}
</style>
