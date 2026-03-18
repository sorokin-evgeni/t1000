<template>
  <div :class="name ? ['nested-object', { 'nested-object--readonly': readonly }] : undefined">
    <div v-if="schema.title" class="nested-object-title">{{ schema.title }}</div>
    <div v-if="schema.description" class="nested-object-description">{{ schema.description }}</div>
    <component
      v-for="(fieldSchema, fieldKey) in schema.properties"
      :key="String(fieldKey)"
      :is="resolveFieldComponent(fieldSchema)"
      v-bind="buildSubFieldProps(String(fieldKey), fieldSchema)"
      :name="buildFieldName(String(fieldKey))"
      :readonly="readonly"
    />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { fieldRegistry } from '../registry/fieldRegistry'
import { getFieldLabel } from '../utils/labelUtils'
import type { JSONSchema } from '../types/schema'

interface Props {
  /** vee-validate path for this field group, e.g. "address". Empty string = top-level (no wrapper div). */
  name?: string
  schema: JSONSchema
  required?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  required: false,
  readonly: false,
})

// No emits — sub-fields call useField(`${name}.subKey`) and connect directly
// to the parent form context provided by DynamicForm's useForm().

function buildFieldName(key: string): string {
  return props.name ? `${props.name}.${key}` : key
}

function resolveFieldComponent(fieldSchema: JSONSchema): Component | undefined {
  return fieldRegistry.resolve(fieldSchema)?.component
}

function buildSubFieldProps(key: string, fieldSchema: JSONSchema): Record<string, unknown> {
  const registration = fieldRegistry.resolve(fieldSchema)
  const label = getFieldLabel(fieldSchema, key)
  const required = (props.schema.required ?? []).includes(key)
  const idPrefix = props.name || 'field'

  return {
    fieldId: `${idPrefix}-${key}`,
    label,
    required,
    hint: fieldSchema.description,
    ...(registration?.buildProps?.(fieldSchema) ?? {}),
  }
}
</script>

<style scoped>
.nested-object {
  margin-bottom: 20px;
  padding: 16px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fafafa;
}

.nested-object--readonly {
  background-color: transparent;
  border-color: #f1f5f9;
}

.nested-object-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.nested-object-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.nested-object > .nested-object-title {
  font-size: 15px;
  margin-bottom: 4px;
}

.nested-object > .nested-object-description {
  font-size: 13px;
  margin-bottom: 16px;
}

.nested-object > :last-child {
  margin-bottom: 0;
}
</style>
