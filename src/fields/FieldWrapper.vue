<template>
  <div class="field-wrapper" :class="{ 'field-wrapper--error': !!errorMessage }">
    <label v-if="label" :for="fieldId" class="field-label">
      {{ label }}
      <span v-if="required" class="field-required" aria-label="required">*</span>
    </label>
    <slot />
    <p v-if="hint && !errorMessage" class="field-hint">{{ hint }}</p>
    <p v-if="errorMessage" class="field-error" role="alert">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  fieldId?: string
  errorMessage?: string
  hint?: string
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  errorMessage: undefined,
  hint: undefined,
  required: false,
})
</script>

<style scoped>
.field-wrapper {
  margin-bottom: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.field-required {
  color: #ef4444;
  margin-left: 2px;
}

.field-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 0;
}

.field-error {
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
  margin-bottom: 0;
}

.field-wrapper--error .field-label {
  color: #ef4444;
}
</style>
