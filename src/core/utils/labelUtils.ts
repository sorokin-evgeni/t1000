import type { JSONSchema } from '../types/schema'

export function getFieldLabel(schema: JSONSchema, key: string): string {
  if (schema.title) return schema.title
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase())
    .trim()
}
