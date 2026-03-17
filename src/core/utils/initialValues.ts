import type { JSONSchema } from '../types/schema'
import { fieldRegistry } from '../registry/fieldRegistry'

export function buildInitialValues(
  schema: JSONSchema,
  existingValues?: Record<string, unknown>,
): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  if (!schema.properties) return values

  for (const [key, fieldSchema] of Object.entries(schema.properties)) {
    const existing = existingValues?.[key]
    if (existing !== undefined) {
      values[key] = existing
    } else if (fieldSchema.default !== undefined) {
      values[key] = fieldSchema.default
    } else {
      const registration = fieldRegistry.resolve(fieldSchema)
      values[key] = registration ? registration.initialValue(fieldSchema) : ''
    }
  }

  return values
}
