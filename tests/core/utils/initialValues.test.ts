import { describe, it, expect } from 'vitest'
import { buildInitialValues } from '../../../src/core/utils/initialValues'
import type { JSONSchema } from '../../../src/core/types/schema'

// Fields are registered via tests/setup.ts

function schema(properties: JSONSchema['properties'], required?: string[]): JSONSchema {
  return { type: 'object', properties, required }
}

describe('buildInitialValues', () => {
  it('returns empty object when schema has no properties', () => {
    expect(buildInitialValues({ type: 'object' })).toEqual({})
  })

  it('initialises string fields with empty string', () => {
    const result = buildInitialValues(schema({ name: { type: 'string' } }))
    expect(result).toEqual({ name: '' })
  })

  it('initialises number and integer fields with undefined', () => {
    const result = buildInitialValues(schema({
      age: { type: 'integer' },
      score: { type: 'number' },
    }))
    expect(result.age).toBeUndefined()
    expect(result.score).toBeUndefined()
  })

  it('initialises boolean fields with false', () => {
    const result = buildInitialValues(schema({ active: { type: 'boolean' } }))
    expect(result.active).toBe(false)
  })

  it('initialises array field with minItems empty strings', () => {
    const result = buildInitialValues(schema({
      tags: { type: 'array', items: { type: 'string' }, minItems: 3 },
    }))
    expect(result.tags).toEqual(['', '', ''])
  })

  it('initialises array field with 1 item when minItems is absent', () => {
    const result = buildInitialValues(schema({
      tags: { type: 'array', items: { type: 'string' } },
    }))
    expect(result.tags).toEqual([''])
  })

  it('initialises array of numbers with undefined items', () => {
    const result = buildInitialValues(schema({
      ports: { type: 'array', items: { type: 'integer' }, minItems: 2 },
    }))
    expect(result.ports).toEqual([undefined, undefined])
  })

  it('initialises nested object fields recursively', () => {
    const result = buildInitialValues(schema({
      address: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          zip: { type: 'string' },
        },
      },
    }))
    expect(result.address).toEqual({ city: '', zip: '' })
  })

  it('uses existing value over type-based default', () => {
    const result = buildInitialValues(
      schema({ name: { type: 'string' }, age: { type: 'integer' } }),
      { name: 'Alice', age: 30 },
    )
    expect(result).toEqual({ name: 'Alice', age: 30 })
  })

  it('uses schema default value when no existing value provided', () => {
    const result = buildInitialValues(schema({
      role: { type: 'string', default: 'viewer' },
    }))
    expect(result.role).toBe('viewer')
  })

  it('existing value takes priority over schema default', () => {
    const result = buildInitialValues(
      schema({ role: { type: 'string', default: 'viewer' } }),
      { role: 'admin' },
    )
    expect(result.role).toBe('admin')
  })

  it('enum fields fall back to text field (catch-all) and get empty string', () => {
    const result = buildInitialValues(schema({
      status: { type: 'string', enum: ['active', 'inactive'] },
    }))
    expect(result.status).toBe('')
  })
})
