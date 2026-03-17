import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, ref, computed, h } from 'vue'
import { DynamicForm } from '../src/index'
import { registrationSchema, registrationDefaults } from './schemas/registrationSchema'
import { profileSchema, profileDefaults } from './schemas/profileSchema'
import { surveySchema } from './schemas/surveySchema'
import { paymentSchema } from './schemas/paymentSchema'
import type { JSONSchema } from '../src/core/types/schema'

// Decorator that wraps the form in a two-column layout with live JSON preview
function withJsonPreview(schema: JSONSchema, initialValues?: Record<string, unknown>) {
  return defineComponent({
    name: 'JsonPreviewWrapper',
    setup() {
      const formValues = ref<Record<string, unknown>>(initialValues || {})
      const submitted = ref<Record<string, unknown> | null>(null)

      function handleUpdate(val: Record<string, unknown>) {
        formValues.value = val
      }

      function handleSubmit(val: Record<string, unknown>) {
        submitted.value = val
      }

      return { formValues, submitted, handleUpdate, handleSubmit }
    },
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '32px',
          alignItems: 'start',
          maxWidth: '1000px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      }, [
        h('div', {}, [
          h(DynamicForm, {
            schema,
            modelValue: this.formValues,
            'onUpdate:modelValue': this.handleUpdate,
            onSubmit: this.handleSubmit,
          }),
          this.submitted
            ? h('div', {
                style: {
                  marginTop: '16px',
                  padding: '12px',
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#166534',
                  fontWeight: '500',
                },
              }, 'Form submitted successfully!')
            : null,
        ]),
        h('div', {
          style: {
            position: 'sticky',
            top: '16px',
          },
        }, [
          h('div', {
            style: {
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#9ca3af',
              marginBottom: '8px',
            },
          }, 'Live Form State'),
          h('pre', {
            style: {
              background: '#1e1e2e',
              color: '#cdd6f4',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: '1.6',
              overflow: 'auto',
              maxHeight: '600px',
              margin: '0',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
            },
          }, JSON.stringify(this.formValues, null, 2)),
        ]),
      ])
    },
  })
}

function withReadonlyPreview(schema: JSONSchema, values: Record<string, unknown>) {
  return defineComponent({
    name: 'ReadonlyPreviewWrapper',
    setup() {
      const formValues = ref<Record<string, unknown>>(values)
      return { formValues }
    },
    render() {
      return h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '32px',
          alignItems: 'start',
          maxWidth: '1000px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      }, [
        h('div', {}, [
          h('div', {
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '12px',
              color: '#0369a1',
              fontWeight: '500',
              marginBottom: '16px',
            },
          }, 'Read-only mode — fields are displayed as text'),
          h(DynamicForm, {
            schema,
            modelValue: this.formValues,
            readonly: true,
          }),
        ]),
        h('div', {
          style: { position: 'sticky', top: '16px' },
        }, [
          h('div', {
            style: {
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#9ca3af',
              marginBottom: '8px',
            },
          }, 'Form Data'),
          h('pre', {
            style: {
              background: '#1e1e2e',
              color: '#cdd6f4',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: '1.6',
              overflow: 'auto',
              maxHeight: '600px',
              margin: '0',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
            },
          }, JSON.stringify(this.formValues, null, 2)),
        ]),
      ])
    },
  })
}

const meta: Meta = {
  title: 'Dynamic Form',
  component: DynamicForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**DynamicForm** is a schema-driven form component that automatically renders form fields based on a JSON Schema definition.

### Features
- Automatic field type resolution from JSON Schema types
- Built-in validation via \`yup\` based on schema constraints
- Support for nested objects with visual grouping
- Readonly mode for displaying submitted data
- v-model support for two-way data binding
- Accessible HTML with proper ARIA attributes

### Field Types
| Schema Type | Format | Rendered As |
|------------|--------|-------------|
| \`string\` | — | Text input |
| \`string\` | \`email\` | Email input |
| \`string\` | \`password\` | Password input |
| \`string\` | \`date\` | Date picker |
| \`string\` | \`textarea\` | Textarea |
| \`number\` / \`integer\` | — | Number input |
| \`boolean\` | — | Checkbox |
| any + \`enum\` | — | Select dropdown |
| \`object\` | — | Nested group |
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

// ─────────────────────────────────────────────
// Story: Registration Form
// ─────────────────────────────────────────────
export const RegistrationForm: StoryObj = {
  name: 'Registration Form',
  parameters: {
    docs: {
      description: {
        story: 'A typical user registration form with text, email, password, number, and boolean fields. All fields are required. Try submitting with empty fields to see validation.',
      },
    },
  },
  render: () => ({
    components: { Wrapper: withJsonPreview(registrationSchema) },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: User Profile (with nested object)
// ─────────────────────────────────────────────
export const UserProfile: StoryObj = {
  name: 'User Profile (Nested Object)',
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates nested object support. The "Address" section is a nested \`object\` type that renders indented with a visual container. Also showcases textarea and date fields.',
      },
    },
  },
  render: () => ({
    components: { Wrapper: withJsonPreview(profileSchema) },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: Survey (various types)
// ─────────────────────────────────────────────
export const Survey: StoryObj = {
  name: 'Survey (Select Fields)',
  parameters: {
    docs: {
      description: {
        story: 'A feedback survey using primarily select (dropdown) fields generated from JSON Schema \`enum\` values. Also includes a date and textarea field.',
      },
    },
  },
  render: () => ({
    components: { Wrapper: withJsonPreview(surveySchema) },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: Payment Form
// ─────────────────────────────────────────────
export const Payment: StoryObj = {
  name: 'Payment Form',
  parameters: {
    docs: {
      description: {
        story: 'Payment form with pattern-based validation for card number and CVV. Demonstrates regex pattern validation from JSON Schema \`pattern\` property.',
      },
    },
  },
  render: () => ({
    components: { Wrapper: withJsonPreview(paymentSchema) },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: Readonly Mode
// ─────────────────────────────────────────────
export const ReadonlyMode: StoryObj = {
  name: 'Readonly Mode',
  parameters: {
    docs: {
      description: {
        story: 'The same registration form rendered in readonly mode. All fields display their values as plain text. No submit button is shown. Pass \`readonly: true\` prop to enable this mode.',
      },
    },
  },
  render: () => ({
    components: {
      Wrapper: withReadonlyPreview(registrationSchema, registrationDefaults),
    },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: Profile Readonly
// ─────────────────────────────────────────────
export const ProfileReadonly: StoryObj = {
  name: 'User Profile (Readonly)',
  parameters: {
    docs: {
      description: {
        story: 'The user profile form in readonly mode, showing how nested objects are displayed in read view.',
      },
    },
  },
  render: () => ({
    components: {
      Wrapper: withReadonlyPreview(profileSchema, profileDefaults),
    },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: Empty (blank form, no schema title)
// ─────────────────────────────────────────────
const minimalSchema: JSONSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      minLength: 3,
    },
    age: {
      type: 'integer',
      title: 'Age',
    },
    role: {
      type: 'string',
      title: 'Role',
      enum: ['Admin', 'Editor', 'Viewer'],
    },
    active: {
      type: 'boolean',
      title: 'Active Account',
    },
  },
  required: ['username'],
}

export const MinimalExample: StoryObj = {
  name: 'Minimal Example',
  parameters: {
    docs: {
      description: {
        story: 'A bare-bones example without a schema title, showing the most common field types side by side.',
      },
    },
  },
  render: () => ({
    components: { Wrapper: withJsonPreview(minimalSchema) },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: Array Fields
// ─────────────────────────────────────────────

const arraySchema: JSONSchema = {
  type: 'object',
  title: 'Server Configuration',
  properties: {
    servers: {
      type: 'array',
      title: 'Available servers',
      description: 'Список доступных серверов',
      items: { type: 'string' },
      minItems: 2,
      maxItems: 4,
    },
    ports: {
      type: 'array',
      title: 'Ports',
      description: 'Allowed port numbers',
      items: { type: 'integer' },
      minItems: 1,
      maxItems: 3,
    },
    tags: {
      type: 'array',
      title: 'Tags',
      description: 'Optional labels (up to 5)',
      items: { type: 'string' },
      maxItems: 5,
    },
  },
  required: ['servers'],
}

export const ArrayFields: StoryObj = {
  name: 'Array Fields',
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates array field support. The "Available servers" field starts with `minItems: 2` items and allows adding up to `maxItems: 4`. Remove button disappears at the minimum, add button disappears at the maximum.',
      },
    },
  },
  render: () => ({
    components: { Wrapper: withJsonPreview(arraySchema) },
    template: '<Wrapper />',
  }),
}

// ─────────────────────────────────────────────
// Story: Playground
// ─────────────────────────────────────────────

const defaultPlaygroundSchema = JSON.stringify({
  type: 'object',
  title: 'My Form',
  properties: {
    name: {
      type: 'string',
      title: 'Full Name',
      minLength: 2,
    },
    email: {
      type: 'string',
      title: 'Email',
      format: 'email',
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 0,
      maximum: 120,
    },
    role: {
      type: 'string',
      title: 'Role',
      enum: ['Admin', 'Editor', 'Viewer'],
    },
    subscribe: {
      type: 'boolean',
      title: 'Subscribe to newsletter',
    },
  },
  required: ['name', 'email'],
}, null, 2)

const PlaygroundComponent = defineComponent({
  name: 'Playground',
  setup() {
    const schemaText = ref(defaultPlaygroundSchema)
    const formValues = ref<Record<string, unknown>>({})
    const parseError = ref<string | null>(null)

    const parsedSchema = computed(() => {
      try {
        const result = JSON.parse(schemaText.value)
        parseError.value = null
        return result
      } catch (e) {
        parseError.value = (e as Error).message
        return null
      }
    })

    const schemaKey = computed(() => schemaText.value)

    function handleSchemaInput(e: Event) {
      schemaText.value = (e.target as HTMLTextAreaElement).value
      formValues.value = {}
    }

    function handleUpdate(val: Record<string, unknown>) {
      formValues.value = val
    }

    return { schemaText, formValues, parseError, parsedSchema, schemaKey, handleSchemaInput, handleUpdate }
  },
  render() {
    const labelStyle = {
      display: 'block',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.08em',
      color: '#9ca3af',
      marginBottom: '8px',
    }

    const preStyle = {
      background: '#1e1e2e',
      color: '#cdd6f4',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '12px',
      lineHeight: '1.6',
      overflow: 'auto' as const,
      maxHeight: '500px',
      margin: '0',
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
    }

    const schemaPanel = h('div', { style: { display: 'flex', flexDirection: 'column' as const, gap: '8px' } }, [
      h('div', { style: labelStyle }, 'JSON Schema'),
      h('textarea', {
        value: this.schemaText,
        onInput: this.handleSchemaInput,
        spellcheck: false,
        style: {
          width: '100%',
          height: '420px',
          padding: '12px',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          fontSize: '12px',
          lineHeight: '1.6',
          border: this.parseError ? '1px solid #ef4444' : '1px solid #e2e8f0',
          borderRadius: '8px',
          background: '#fafafa',
          color: '#1a1a2e',
          resize: 'vertical' as const,
          outline: 'none',
          boxSizing: 'border-box' as const,
        },
      }),
      this.parseError
        ? h('div', {
            style: {
              fontSize: '12px',
              color: '#ef4444',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              padding: '8px 12px',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
            },
          }, `Parse error: ${this.parseError}`)
        : null,
    ])

    const formPanel = this.parsedSchema
      ? h('div', {}, [
          h(DynamicForm, {
            key: this.schemaKey,
            schema: this.parsedSchema,
            modelValue: this.formValues,
            'onUpdate:modelValue': this.handleUpdate,
          }),
        ])
      : h('div', {
          style: {
            padding: '40px 20px',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '14px',
            border: '1px dashed #e2e8f0',
            borderRadius: '8px',
          },
        }, 'Fix the schema to render the form')

    const statePanel = h('div', {}, [
      h('div', { style: labelStyle }, 'Live Form State'),
      h('pre', { style: preStyle }, JSON.stringify(this.formValues, null, 2)),
    ])

    return h('div', {
      style: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 280px',
        gap: '24px',
        alignItems: 'start',
        maxWidth: '1200px',
      },
    }, [schemaPanel, formPanel, statePanel])
  },
})

export const Playground: StoryObj = {
  name: 'Playground',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Введите любую JSON Schema в textarea слева — форма перестроится автоматически. Справа отображается live-состояние формы.',
      },
    },
  },
  render: () => ({
    components: { PlaygroundComponent },
    template: '<PlaygroundComponent />',
  }),
}
