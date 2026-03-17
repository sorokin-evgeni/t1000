<template>
  <div
    class="field-wrapper"
    :class="{
      'field-wrapper--error': !!displayError,
      'field-wrapper--valid': meta.touched && meta.valid && !displayError,
    }"
  >
    <div v-if="label" class="field-label">
      {{ label }}
      <span v-if="required" class="field-required" aria-label="required">*</span>
    </div>

    <div class="array-items">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="array-item"
      >
        <span v-if="readonly" class="readonly-value">{{ item || '—' }}</span>
        <template v-else>
          <input
            v-if="itemInputType === 'number'"
            :value="item"
            type="number"
            class="field-input"
            :class="{ 'field-input--error': !!displayError }"
            :placeholder="`Item ${index + 1}`"
            :aria-label="`${label} item ${index + 1}`"
            @input="handleItemInput(index, $event)"
          />
          <input
            v-else
            :value="item"
            type="text"
            class="field-input"
            :class="{ 'field-input--error': !!displayError }"
            :placeholder="`Item ${index + 1}`"
            :aria-label="`${label} item ${index + 1}`"
            @input="handleItemInput(index, $event)"
          />
          <button
            v-if="canRemove"
            type="button"
            class="btn-remove"
            :aria-label="`Remove item ${index + 1}`"
            @click="removeItem(index)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            </svg>
          </button>
        </template>
      </div>
    </div>

    <button
      v-if="!readonly && canAdd"
      type="button"
      class="btn-add"
      @click="addItem"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
      </svg>
      Add item
    </button>

    <p v-if="hint && !displayError" class="field-hint">{{ hint }}</p>
    <p v-if="displayError" class="field-error" role="alert">{{ displayError }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useField } from 'vee-validate'
import type { JSONSchema } from '../core/types/schema'

interface Props {
  name: string
  label?: string
  fieldId?: string
  hint?: string
  required?: boolean
  readonly?: boolean
  itemSchema?: JSONSchema
  minItems?: number
  maxItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  fieldId: undefined,
  hint: undefined,
  required: false,
  readonly: false,
  itemSchema: undefined,
  minItems: undefined,
  maxItems: undefined,
})

const { value, errorMessage, handleChange, handleBlur, meta } = useField<unknown[]>(
  () => props.name,
)

const displayError = computed(() => (meta.touched ? errorMessage.value : undefined))

const items = computed(() => value.value ?? [])

const itemInputType = computed(() => {
  const t = Array.isArray(props.itemSchema?.type) ? props.itemSchema?.type[0] : props.itemSchema?.type
  return t === 'number' || t === 'integer' ? 'number' : 'text'
})

const canRemove = computed(() => items.value.length > (props.minItems ?? 0))
const canAdd = computed(() => items.value.length < (props.maxItems ?? Infinity))

function handleItemInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const newItems = [...items.value]
  newItems[index] = itemInputType.value === 'number'
    ? (target.value === '' ? undefined : Number(target.value))
    : target.value
  handleChange(newItems)
}

function addItem() {
  const newItem = itemInputType.value === 'number' ? undefined : ''
  handleChange([...items.value, newItem])
}

function removeItem(index: number) {
  const newItems = items.value.filter((_, i) => i !== index)
  handleChange(newItems)
  handleBlur()
}
</script>

<style scoped>
.field-wrapper {
  margin-bottom: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

.field-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.field-wrapper--error .field-label {
  color: #ef4444;
}

.field-wrapper--valid .field-label {
  color: #10b981;
}

.field-required {
  color: #ef4444;
  margin-left: 2px;
}

.array-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.array-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-input {
  flex: 1;
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

.field-wrapper--valid .field-input {
  border-color: #10b981;
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  flex-shrink: 0;
  color: #9ca3af;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  outline: none;
}

.btn-remove:hover {
  color: #ef4444;
  border-color: #ef4444;
  background: #fef2f2;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  color: #4f46e5;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  outline: none;
}

.btn-add:hover {
  background: #e0e7ff;
  border-color: #a5b4fc;
}

.readonly-value {
  display: block;
  font-size: 14px;
  color: #111827;
  padding: 4px 0;
}

.field-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 0;
}

.field-error {
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
  margin-bottom: 0;
}
</style>
