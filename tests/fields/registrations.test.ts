import { describe, it, expect } from 'vitest'
import { fieldRegistry } from '../../src/core/registry/fieldRegistry'
import type { JSONSchema } from '../../src/core/types/schema'

// Fields are registered via tests/setup.ts

function resolve(schema: JSONSchema) {
  const reg = fieldRegistry.resolve(schema)
  if (!reg) throw new Error(`No registration found for schema: ${JSON.stringify(schema)}`)
  return reg
}

// ─── matches ─────────────────────────────────────────────────────────────────

describe('matches — enum/select', () => {
  it('matches schema with enum array', () => {
    expect(fieldRegistry.resolve({ type: 'string', enum: ['a', 'b'] })).toBeDefined()
    const reg = resolve({ type: 'string', enum: ['a', 'b'] })
    expect(reg.matches({ type: 'string', enum: ['a', 'b'] })).toBe(true)
  })

  it('takes priority over plain string', () => {
    const enumReg = resolve({ type: 'string', enum: ['x'] })
    const strReg = resolve({ type: 'string' })
    expect(enumReg).not.toBe(strReg)
  })
})

describe('matches — primitive types', () => {
  const cases: [string, JSONSchema][] = [
    ['array',    { type: 'array', items: { type: 'string' } }],
    ['object',   { type: 'object', properties: {} }],
    ['boolean',  { type: 'boolean' }],
    ['integer',  { type: 'integer' }],
    ['number',   { type: 'number' }],
    ['string',   { type: 'string' }],
  ]

  for (const [label, schema] of cases) {
    it(`resolves ${label}`, () => {
      expect(fieldRegistry.resolve(schema)).toBeDefined()
    })
  }
})

describe('matches — date and textarea (format-based)', () => {
  it('resolves date format', () => {
    const reg = resolve({ type: 'string', format: 'date' })
    expect(reg.matches({ type: 'string', format: 'date' })).toBe(true)
    expect(reg.matches({ type: 'string' })).toBe(false)
  })

  it('resolves textarea format', () => {
    const reg = resolve({ type: 'string', format: 'textarea' })
    expect(reg.matches({ type: 'string', format: 'textarea' })).toBe(true)
    expect(reg.matches({ type: 'string' })).toBe(false)
  })

  it('resolves date-time format as date', () => {
    expect(fieldRegistry.resolve({ type: 'string', format: 'date-time' })).toBeDefined()
  })
})

describe('matches — catch-all fallback', () => {
  it('resolves unknown type via catch-all', () => {
    expect(fieldRegistry.resolve({ type: 'null' })).toBeDefined()
    expect(fieldRegistry.resolve({})).toBeDefined()
  })
})

// ─── buildProps ───────────────────────────────────────────────────────────────

describe('buildProps', () => {
  it('number: includes minimum, maximum, isInteger', () => {
    const reg = resolve({ type: 'integer', minimum: 1, maximum: 99 })
    const props = reg.buildProps!({ type: 'integer', minimum: 1, maximum: 99 })
    expect(props.minimum).toBe(1)
    expect(props.maximum).toBe(99)
    expect(props.isInteger).toBe(true)
  })

  it('number: isInteger is false for type number', () => {
    const reg = resolve({ type: 'number' })
    const props = reg.buildProps!({ type: 'number' })
    expect(props.isInteger).toBe(false)
  })

  it('select: includes enumValues', () => {
    const schema: JSONSchema = { type: 'string', enum: ['a', 'b', 'c'] }
    const reg = resolve(schema)
    const props = reg.buildProps!(schema)
    expect(props.enumValues).toEqual(['a', 'b', 'c'])
  })

  it('array: includes itemSchema, minItems, maxItems', () => {
    const schema: JSONSchema = {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 5,
    }
    const reg = resolve(schema)
    const props = reg.buildProps!(schema)
    expect(props.itemSchema).toEqual({ type: 'string' })
    expect(props.minItems).toBe(1)
    expect(props.maxItems).toBe(5)
  })

  it('text: includes format', () => {
    const schema: JSONSchema = { type: 'string', format: 'email' }
    const reg = resolve(schema)
    const props = reg.buildProps!(schema)
    expect(props.format).toBe('email')
  })
})

// ─── initialValue ─────────────────────────────────────────────────────────────

describe('initialValue', () => {
  it('string → empty string', () => {
    expect(resolve({ type: 'string' }).initialValue({ type: 'string' })).toBe('')
  })

  it('number → undefined', () => {
    expect(resolve({ type: 'number' }).initialValue({ type: 'number' })).toBeUndefined()
  })

  it('integer → undefined', () => {
    expect(resolve({ type: 'integer' }).initialValue({ type: 'integer' })).toBeUndefined()
  })

  it('boolean → false', () => {
    expect(resolve({ type: 'boolean' }).initialValue({ type: 'boolean' })).toBe(false)
  })

  it('select/enum → empty string', () => {
    const schema: JSONSchema = { type: 'string', enum: ['x', 'y'] }
    expect(resolve(schema).initialValue(schema)).toBe('')
  })

  it('array: creates minItems empty strings for string items', () => {
    const schema: JSONSchema = { type: 'array', items: { type: 'string' }, minItems: 3 }
    expect(resolve(schema).initialValue(schema)).toEqual(['', '', ''])
  })

  it('array: creates 1 item when minItems absent', () => {
    const schema: JSONSchema = { type: 'array', items: { type: 'string' } }
    expect(resolve(schema).initialValue(schema)).toEqual([''])
  })

  it('array: creates undefined items for number type', () => {
    const schema: JSONSchema = { type: 'array', items: { type: 'integer' }, minItems: 2 }
    expect(resolve(schema).initialValue(schema)).toEqual([undefined, undefined])
  })

  it('object: recursively initialises sub-fields', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        city: { type: 'string' },
        count: { type: 'integer' },
      },
    }
    expect(resolve(schema).initialValue(schema)).toEqual({ city: '', count: undefined })
  })
})

// ─── object: no applyValue (sub-fields use useField with dot-path natively) ──

describe('object registration — no applyValue needed', () => {
  it('does not define applyValue (vee-validate handles dot paths)', () => {
    const reg = resolve({ type: 'object', properties: {} })
    expect(reg).not.toHaveProperty('applyValue')
  })
})
