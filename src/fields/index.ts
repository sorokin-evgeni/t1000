/**
 * Fields layer — registers all built-in field types in the fieldRegistry.
 *
 * Registration order matters: more specific matchers must come first.
 * Each entry is self-contained: component + props builder + validator + initial value.
 */

import * as yup from 'yup'
import { fieldRegistry } from '../core/registry/fieldRegistry'
import type { JSONSchema } from '../core/types/schema'
import NestedObjectField from '../core/components/NestedObjectField.vue'
import TextField from './TextField.vue'
import NumberField from './NumberField.vue'
import BooleanField from './BooleanField.vue'
import SelectField from './SelectField.vue'
import TextareaField from './TextareaField.vue'
import DateField from './DateField.vue'
import ArrayField from './ArrayField.vue'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function schemaType(schema: JSONSchema): string | undefined {
  return Array.isArray(schema.type) ? schema.type[0] : schema.type
}

function buildStringValidator(schema: JSONSchema, label: string, isRequired: boolean): yup.Schema {
  let v = yup.string().label(label)
  if (schema.minLength !== undefined)
    v = v.min(schema.minLength, `${label} must be at least ${schema.minLength} characters`)
  if (schema.maxLength !== undefined)
    v = v.max(schema.maxLength, `${label} must be at most ${schema.maxLength} characters`)
  if (schema.pattern)
    v = v.matches(new RegExp(schema.pattern), `${label} format is invalid`)
  if (schema.format === 'email')
    v = v.email(`${label} must be a valid email address`)
  if (isRequired)
    v = v.required(`${label} is required`)
  return v
}

// ─── 1. Select (enum) — must precede string/number to win the match ───────────

fieldRegistry.register({
  matches: schema => !!(schema.enum && schema.enum.length > 0),

  component: SelectField,

  buildProps: schema => ({ enumValues: schema.enum }),

  buildValidator: (schema, label, isRequired) => {
    const values = (schema.enum ?? []).map(String)
    let v = yup.string().label(label)
    if (isRequired) v = v.required(`${label} is required`)
    return v.oneOf([...values, ''], `${label} must be one of the allowed values`)
  },

  initialValue: () => '',
})

// ─── 2. Array ────────────────────────────────────────────────────────────────

fieldRegistry.register({
  matches: schema => schemaType(schema) === 'array',

  component: ArrayField,

  buildProps: schema => ({
    itemSchema: schema.items,
    minItems: schema.minItems,
    maxItems: schema.maxItems,
  }),

  buildValidator: (schema, label, isRequired) => {
    // Re-use the registry to validate items — works for any registered item type
    const itemSchema = schema.items
    const itemReg = itemSchema ? fieldRegistry.resolve(itemSchema) : undefined
    const itemValidator = itemReg
      ? itemReg.buildValidator(itemSchema!, label, false)
      : yup.mixed()

    let v = yup.array().of(itemValidator).label(label)
    if (schema.minItems !== undefined)
      v = v.min(schema.minItems, `${label} must have at least ${schema.minItems} item(s)`)
    if (schema.maxItems !== undefined)
      v = v.max(schema.maxItems, `${label} must have at most ${schema.maxItems} item(s)`)
    if (isRequired) v = v.required(`${label} is required`)
    return v
  },

  initialValue: schema => {
    const count = schema.minItems ?? 1
    const itemType = schemaType(schema.items ?? {})
    return Array.from(
      { length: count },
      () => (itemType === 'number' || itemType === 'integer' ? undefined : ''),
    )
  },
})

// ─── 3. Object (nested group) ─────────────────────────────────────────────────

fieldRegistry.register({
  matches: schema => schemaType(schema) === 'object',

  component: NestedObjectField,

  // Pass the full sub-schema so NestedObjectField can render its children.
  // The `name` prop is added automatically by DynamicForm so sub-fields can
  // construct their full paths (e.g. "address.city") for useField().
  buildProps: schema => ({ schema }),

  buildValidator: (schema, label) => {
    const shape: Record<string, yup.Schema> = {}
    if (schema.properties) {
      const required = schema.required ?? []
      for (const [k, fieldSchema] of Object.entries(schema.properties)) {
        const reg = fieldRegistry.resolve(fieldSchema)
        const subLabel = fieldSchema.title || k
        shape[k] = reg
          ? reg.buildValidator(fieldSchema, subLabel, required.includes(k))
          : yup.mixed()
      }
    }
    return yup.object(shape).label(label)
  },

  initialValue: schema => {
    const values: Record<string, unknown> = {}
    if (schema.properties) {
      for (const [k, fieldSchema] of Object.entries(schema.properties)) {
        const reg = fieldRegistry.resolve(fieldSchema)
        values[k] = reg ? reg.initialValue(fieldSchema) : ''
      }
    }
    return values
  },
})

// ─── 4. Boolean ───────────────────────────────────────────────────────────────

fieldRegistry.register({
  matches: schema => schemaType(schema) === 'boolean',

  component: BooleanField,

  buildValidator: (_schema, label, isRequired) => {
    let v = yup.boolean().label(label)
    if (isRequired)
      v = v.oneOf([true], `${label} must be checked`).required(`${label} is required`)
    return v
  },

  initialValue: () => false,
})

// ─── 5. Number / integer ──────────────────────────────────────────────────────

fieldRegistry.register({
  matches: schema => schemaType(schema) === 'number' || schemaType(schema) === 'integer',

  component: NumberField,

  buildProps: schema => ({
    minimum: schema.minimum,
    maximum: schema.maximum,
    isInteger: schemaType(schema) === 'integer',
  }),

  buildValidator: (schema, label, isRequired) => {
    let v = yup.number().label(label).typeError(`${label} must be a number`)
    if (schemaType(schema) === 'integer')
      v = v.integer(`${label} must be an integer`)
    if (schema.minimum !== undefined)
      v = v.min(schema.minimum, `${label} must be at least ${schema.minimum}`)
    if (schema.maximum !== undefined)
      v = v.max(schema.maximum, `${label} must be at most ${schema.maximum}`)
    if (isRequired) v = v.required(`${label} is required`)
    return v.nullable()
  },

  initialValue: () => undefined,
})

// ─── 6. Date ──────────────────────────────────────────────────────────────────

fieldRegistry.register({
  matches: schema =>
    schemaType(schema) === 'string' &&
    (schema.format === 'date' || schema.format === 'date-time'),

  component: DateField,
  buildValidator: buildStringValidator,
  initialValue: () => '',
})

// ─── 7. Textarea ──────────────────────────────────────────────────────────────

fieldRegistry.register({
  matches: schema =>
    schemaType(schema) === 'string' && schema.format === 'textarea',

  component: TextareaField,
  buildValidator: buildStringValidator,
  initialValue: () => '',
})

// ─── 8. Text — catch-all fallback (must be last) ──────────────────────────────
//
// Matches anything that no previous registration claimed.
// Renders as a plain text input so unknown schema types degrade gracefully.

fieldRegistry.register({
  matches: () => true,

  component: TextField,
  buildProps: schema => ({ format: schema.format }),
  buildValidator: buildStringValidator,
  initialValue: () => '',
})
