import type { Component } from 'vue'
import type { Schema } from 'yup'
import type { JSONSchema } from '../types/schema'

export interface FieldRegistration {
  /** Returns true if this registration handles the given JSON Schema node */
  matches: (schema: JSONSchema) => boolean

  /** Vue component to render */
  component: Component

  /**
   * Props derived solely from the schema (no form state needed).
   * Examples: enumValues, minimum/maximum, itemSchema.
   * The `name` prop is always added by DynamicForm automatically.
   */
  buildProps?: (schema: JSONSchema) => Record<string, unknown>

  /** Build a yup validator from the schema constraints */
  buildValidator: (schema: JSONSchema, label: string, isRequired: boolean) => Schema

  /** Produce the initial/empty value for this field type */
  initialValue: (schema: JSONSchema) => unknown
}
