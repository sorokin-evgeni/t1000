import { describe, it, expect } from 'vitest'
import { getFieldLabel } from '../../../src/core/utils/labelUtils'

describe('getFieldLabel', () => {
  it('returns schema title when present', () => {
    expect(getFieldLabel({ type: 'string', title: 'Full Name' }, 'fullName')).toBe('Full Name')
  })

  it('converts camelCase key to Title Case when no title', () => {
    expect(getFieldLabel({ type: 'string' }, 'fullName')).toBe('Full Name')
    expect(getFieldLabel({ type: 'string' }, 'firstName')).toBe('First Name')
    expect(getFieldLabel({ type: 'string' }, 'emailAddress')).toBe('Email Address')
  })

  it('converts snake_case key to Title Case', () => {
    expect(getFieldLabel({ type: 'string' }, 'first_name')).toBe('First name')
    expect(getFieldLabel({ type: 'string' }, 'postal_code')).toBe('Postal code')
  })

  it('capitalises a simple lowercase key', () => {
    expect(getFieldLabel({ type: 'string' }, 'name')).toBe('Name')
    expect(getFieldLabel({ type: 'string' }, 'age')).toBe('Age')
  })

  it('prefers title over key derivation', () => {
    expect(getFieldLabel({ type: 'string', title: 'Email address' }, 'email')).toBe('Email address')
  })
})
