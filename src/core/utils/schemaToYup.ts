import * as yup from 'yup'
import type { JSONSchema } from '../types/schema'
import { fieldRegistry } from '../registry/fieldRegistry'
import { getFieldLabel } from './labelUtils'

export function schemaToYup(schema: JSONSchema): yup.ObjectSchema<Record<string, unknown>> {
  return yup.object(buildShape(schema))
}

function buildShape(schema: JSONSchema): Record<string, yup.Schema> {
  if (!schema.properties) return {}

  const required = schema.required ?? []
  const shape: Record<string, yup.Schema> = {}

  for (const [key, fieldSchema] of Object.entries(schema.properties)) {
    const isRequired = required.includes(key)
    const label = getFieldLabel(fieldSchema, key)
    const registration = fieldRegistry.resolve(fieldSchema)
    shape[key] = registration
      ? registration.buildValidator(fieldSchema, label, isRequired)
      : yup.mixed()
  }

  return shape
}
