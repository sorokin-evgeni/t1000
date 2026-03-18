# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm test              # run all tests once
npm run test:watch    # run tests in watch mode
npm run build         # type-check + build library to dist/
npm run storybook     # component docs at http://localhost:6006
```

Run a single test file:
```bash
npx vitest run tests/fields/BooleanField.test.ts
```

Run tests matching a pattern:
```bash
npx vitest run -t "matches"
```

## Architecture

This is a Vue 3 library that renders forms from JSON Schema (draft-07) with automatic yup validation. The public API is just four exports from `src/index.ts`: `DynamicForm`, `fieldRegistry`, `FieldRegistration`, `JSONSchema`.

### Core flow

1. `DynamicForm` receives a `schema` prop, builds a yup validator via `schemaToYup()`, and sets up vee-validate's `useForm()`.
2. It delegates all field rendering to `NestedObjectField`, passing the full schema.
3. `NestedObjectField` iterates `schema.properties`, calls `fieldRegistry.resolve(fieldSchema)` for each field, and renders the matched component. When called recursively for nested objects, the `name` prop carries the vee-validate dot-path prefix (e.g. `"address"`), making sub-field paths like `"address.city"`.
4. Each leaf field calls vee-validate's `useField(name)` — this connects directly to the parent form context provided by `DynamicForm`.

### Field Registry

`src/core/registry/fieldRegistry.ts` is a singleton that holds an ordered list of `FieldRegistration` objects. `resolve(schema)` returns the **first** registration whose `matches(schema)` returns true.

**Registration order matters** — more specific matchers must be registered before generic ones. The built-in registrations in `src/fields/index.ts` register in this order: enum/select → array → object → boolean → number/integer → date → textarea → text (catch-all).

A `FieldRegistration` defines:
- `matches(schema)` — when to use this field type
- `component` — the Vue component to render
- `buildProps?(schema)` — extra props derived from schema (e.g. `options` for select)
- `buildValidator(schema, label, isRequired)` — returns a yup schema for this field
- `initialValue(schema)` — default value when no `modelValue` is provided

### Validation

`schemaToYup()` builds a yup `ObjectSchema` by iterating `schema.properties` and delegating each field's validator to its registration's `buildValidator()`. Nested objects and arrays compose validators recursively. The result is passed to vee-validate's `validationSchema` option.

### FieldWrapper

`src/fields/FieldWrapper.vue` is a presentational wrapper used by all built-in field components. It renders the label, required marker, hint text, and validation error. Field components pass `fieldId`, `label`, `required`, `hint`, and expose `errorMessage` from `useField()` to FieldWrapper.

### Key utilities

- `src/core/utils/labelUtils.ts` — `getFieldLabel(schema, key)`: prefers `schema.title`, falls back to converting the camelCase/snake_case key to Title Case
- `src/core/utils/initialValues.ts` — `buildInitialValues(schema, modelValue)`: builds the initial form values object recursively
- `src/core/utils/schemaToYup.ts` — `schemaToYup(schema)`: converts a root JSON Schema to a yup ObjectSchema

### Tests

`tests/setup.ts` registers all built-in fields before each test suite. Component-level tests (e.g. `BooleanField.test.ts`) mount `DynamicForm` directly — the field registry is already populated by setup.ts.
