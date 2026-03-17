// Register all built-in field types before anything else
import './fields/index'

// Public API
export { default as DynamicForm } from './core/components/DynamicForm.vue'
export { fieldRegistry } from './core/registry/fieldRegistry'
export type { FieldRegistration } from './core/registry/types'
export type { JSONSchema } from './core/types/schema'
