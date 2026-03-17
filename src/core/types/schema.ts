export type JSONSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null'

export interface JSONSchema {
  type?: JSONSchemaType | JSONSchemaType[]
  title?: string
  description?: string
  properties?: Record<string, JSONSchema>
  required?: string[]
  enum?: (string | number | boolean | null)[]
  format?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  pattern?: string
  default?: unknown
  items?: JSONSchema
  minItems?: number
  maxItems?: number
  additionalProperties?: boolean | JSONSchema
  $schema?: string
  $id?: string
  allOf?: JSONSchema[]
  anyOf?: JSONSchema[]
  oneOf?: JSONSchema[]
  not?: JSONSchema
  if?: JSONSchema
  then?: JSONSchema
  else?: JSONSchema
  const?: unknown
  readOnly?: boolean
  writeOnly?: boolean
  examples?: unknown[]
}
