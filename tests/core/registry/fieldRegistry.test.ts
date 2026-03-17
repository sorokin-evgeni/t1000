import { describe, it, expect, beforeEach } from 'vitest'
import { FieldRegistry } from '../../../src/core/registry/fieldRegistry'
import type { FieldRegistration } from '../../../src/core/registry/types'
import * as yup from 'yup'
import { defineComponent } from 'vue'

const stubComponent = defineComponent({ template: '<div />' })

function makeRegistration(matchFn: (s: object) => boolean): FieldRegistration {
  return {
    matches: matchFn as FieldRegistration['matches'],
    component: stubComponent,
    buildValidator: () => yup.mixed(),
    initialValue: () => '',
  }
}

describe('FieldRegistry', () => {
  let registry: FieldRegistry

  beforeEach(() => {
    registry = new FieldRegistry()
  })

  it('returns undefined when no registrations exist', () => {
    expect(registry.resolve({ type: 'string' })).toBeUndefined()
  })

  it('resolves a registered field by its matcher', () => {
    const reg = makeRegistration(s => (s as { type?: string }).type === 'string')
    registry.register(reg)
    expect(registry.resolve({ type: 'string' })).toBe(reg)
  })

  it('returns undefined when no matcher matches', () => {
    registry.register(makeRegistration(s => (s as { type?: string }).type === 'string'))
    expect(registry.resolve({ type: 'number' })).toBeUndefined()
  })

  it('returns the first matching registration when multiple match', () => {
    const first = makeRegistration(() => true)
    const second = makeRegistration(() => true)
    registry.register(first)
    registry.register(second)
    expect(registry.resolve({ type: 'string' })).toBe(first)
  })

  it('respects registration order — more specific before generic', () => {
    const generic = makeRegistration(() => true)
    const specific = makeRegistration(s => (s as { type?: string }).type === 'string')
    registry.register(specific)
    registry.register(generic)

    expect(registry.resolve({ type: 'string' })).toBe(specific)
    expect(registry.resolve({ type: 'number' })).toBe(generic)
  })

  it('supports multiple registrations for different types', () => {
    const strReg = makeRegistration(s => (s as { type?: string }).type === 'string')
    const numReg = makeRegistration(s => (s as { type?: string }).type === 'number')
    registry.register(strReg)
    registry.register(numReg)

    expect(registry.resolve({ type: 'string' })).toBe(strReg)
    expect(registry.resolve({ type: 'number' })).toBe(numReg)
    expect(registry.resolve({ type: 'boolean' })).toBeUndefined()
  })
})
