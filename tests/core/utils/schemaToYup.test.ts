import { describe, it, expect } from 'vitest'
import { schemaToYup } from '../../../src/core/utils/schemaToYup'
import type { JSONSchema } from '../../../src/core/types/schema'

// Fields are registered via tests/setup.ts

function validate(schema: JSONSchema, data: Record<string, unknown>) {
  return schemaToYup(schema).validate(data, { abortEarly: false })
}

async function expectValid(schema: JSONSchema, data: Record<string, unknown>) {
  await expect(validate(schema, data)).resolves.toBeDefined()
}

async function expectInvalid(schema: JSONSchema, data: Record<string, unknown>) {
  await expect(validate(schema, data)).rejects.toThrow()
}

describe('schemaToYup — string', () => {
  it('accepts any string when not required', () => expectValid(
    { type: 'object', properties: { name: { type: 'string' } } },
    { name: '' },
  ))

  it('rejects empty string when required', () => expectInvalid(
    { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
    { name: '' },
  ))

  it('accepts non-empty string when required', () => expectValid(
    { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] },
    { name: 'Alice' },
  ))

  it('enforces minLength', () => expectInvalid(
    { type: 'object', properties: { name: { type: 'string', minLength: 3 } } },
    { name: 'ab' },
  ))

  it('passes minLength', () => expectValid(
    { type: 'object', properties: { name: { type: 'string', minLength: 3 } } },
    { name: 'abc' },
  ))

  it('enforces maxLength', () => expectInvalid(
    { type: 'object', properties: { bio: { type: 'string', maxLength: 5 } } },
    { bio: 'toolong' },
  ))

  it('validates email format', () => expectInvalid(
    { type: 'object', properties: { email: { type: 'string', format: 'email' } }, required: ['email'] },
    { email: 'not-an-email' },
  ))

  it('accepts valid email', () => expectValid(
    { type: 'object', properties: { email: { type: 'string', format: 'email' } }, required: ['email'] },
    { email: 'user@example.com' },
  ))

  it('validates pattern', () => expectInvalid(
    { type: 'object', properties: { code: { type: 'string', pattern: '^[A-Z]{3}$' } }, required: ['code'] },
    { code: 'abc' },
  ))

  it('accepts matching pattern', () => expectValid(
    { type: 'object', properties: { code: { type: 'string', pattern: '^[A-Z]{3}$' } }, required: ['code'] },
    { code: 'ABC' },
  ))
})

describe('schemaToYup — number / integer', () => {
  it('rejects non-number when required', () => expectInvalid(
    { type: 'object', properties: { age: { type: 'integer' } }, required: ['age'] },
    { age: undefined },
  ))

  it('enforces minimum', () => expectInvalid(
    { type: 'object', properties: { age: { type: 'integer', minimum: 18 } } },
    { age: 17 },
  ))

  it('accepts value at minimum', () => expectValid(
    { type: 'object', properties: { age: { type: 'integer', minimum: 18 } } },
    { age: 18 },
  ))

  it('enforces maximum', () => expectInvalid(
    { type: 'object', properties: { score: { type: 'number', maximum: 100 } } },
    { score: 101 },
  ))

  it('rejects float for integer type', () => expectInvalid(
    { type: 'object', properties: { count: { type: 'integer' } }, required: ['count'] },
    { count: 1.5 },
  ))
})

describe('schemaToYup — boolean', () => {
  it('accepts false when not required', () => expectValid(
    { type: 'object', properties: { agree: { type: 'boolean' } } },
    { agree: false },
  ))

  it('rejects false when required (must be checked)', () => expectInvalid(
    { type: 'object', properties: { agree: { type: 'boolean' } }, required: ['agree'] },
    { agree: false },
  ))

  it('accepts true when required', () => expectValid(
    { type: 'object', properties: { agree: { type: 'boolean' } }, required: ['agree'] },
    { agree: true },
  ))
})

describe('schemaToYup — enum / select', () => {
  it('accepts a value from the enum list', () => expectValid(
    { type: 'object', properties: { role: { type: 'string', enum: ['admin', 'user'] } } },
    { role: 'admin' },
  ))

  it('rejects a value not in the enum list', () => expectInvalid(
    { type: 'object', properties: { role: { type: 'string', enum: ['admin', 'user'] } }, required: ['role'] },
    { role: 'superuser' },
  ))
})

describe('schemaToYup — array', () => {
  it('enforces minItems', () => expectInvalid(
    { type: 'object', properties: { tags: { type: 'array', items: { type: 'string' }, minItems: 2 } } },
    { tags: ['only-one'] },
  ))

  it('accepts array meeting minItems', () => expectValid(
    { type: 'object', properties: { tags: { type: 'array', items: { type: 'string' }, minItems: 2 } } },
    { tags: ['a', 'b'] },
  ))

  it('enforces maxItems', () => expectInvalid(
    { type: 'object', properties: { tags: { type: 'array', items: { type: 'string' }, maxItems: 2 } } },
    { tags: ['a', 'b', 'c'] },
  ))
})

describe('schemaToYup — nested object', () => {
  const addressSchema: JSONSchema = {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          zip: { type: 'string', minLength: 5 },
        },
        required: ['city'],
      },
    },
  }

  it('validates nested required fields', () => expectInvalid(
    addressSchema,
    { address: { city: '', zip: '12345' } },
  ))

  it('validates nested field constraints', () => expectInvalid(
    addressSchema,
    { address: { city: 'Paris', zip: '123' } },
  ))

  it('accepts valid nested object', () => expectValid(
    addressSchema,
    { address: { city: 'Paris', zip: '75001' } },
  ))
})

describe('schemaToYup — unknown type (catch-all)', () => {
  it('accepts any value for an unknown type without crashing', async () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: { custom: { type: 'null' } },
    }
    await expectValid(schema, { custom: '' })
  })
})
