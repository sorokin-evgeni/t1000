import type { FieldRegistration } from './types'
import type { JSONSchema } from '../types/schema'

export class FieldRegistry {
  private readonly _registrations: FieldRegistration[] = []

  /**
   * Register a new field type. Registrations are evaluated in order,
   * so more specific matchers should be registered before generic ones.
   */
  register(registration: FieldRegistration): void {
    this._registrations.push(registration)
  }

  /**
   * Find the first registration whose matcher returns true for the given schema.
   * Returns undefined if no registration matches.
   */
  resolve(schema: JSONSchema): FieldRegistration | undefined {
    return this._registrations.find(r => r.matches(schema))
  }
}

export const fieldRegistry = new FieldRegistry()
