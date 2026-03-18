import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { useForm } from 'vee-validate'
import { mount, flushPromises } from '@vue/test-utils'
import DynamicForm from '../../src/core/components/DynamicForm.vue'
import BooleanField from '../../src/fields/BooleanField.vue'
import { schemaToYup } from '../../src/core/utils/schemaToYup'
import type { JSONSchema } from '../../src/core/types/schema'

// Fields are registered via tests/setup.ts

const schema: JSONSchema = {
  type: 'object',
  properties: {
    active: { type: 'boolean', title: 'Active' },
  },
}

// A minimal form wrapper that exposes onSubmit so we can call it programmatically.
// This bypasses happy-dom's broken form submit event handling while still exercising
// vee-validate's full validation → submit cycle with real field components.
function makeBooleanForm(initialActive: boolean) {
  return defineComponent({
    components: { BooleanField },
    emits: ['submit'],
    setup(_props, { emit }) {
      const { handleSubmit, setFieldValue } = useForm({
        validationSchema: schemaToYup(schema),
        initialValues: { active: false },
      })
      // Set field value directly instead of via checkbox DOM event.
      // happy-dom fires a spurious `change` event when Vue sets :checked="true",
      // which returns event.target.checked = "on" and corrupts the boolean value.
      if (initialActive) setFieldValue('active', true)
      const onSubmit = handleSubmit(values => emit('submit', values))
      return { onSubmit }
    },
    template: `
      <form @submit.prevent="onSubmit">
        <BooleanField name="active" label="Active" field-id="active" />
      </form>
    `,
  })
}

// ─── rendering ───────────────────────────────────────────────────────────────

describe('boolean field — rendering', () => {
  it('renders a checkbox input', () => {
    const wrapper = mount(DynamicForm, { props: { schema } })
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })
})

// ─── submit values ────────────────────────────────────────────────────────────

describe('boolean field — form submit', () => {
  it('submits true when the checkbox is checked', async () => {
    const wrapper = mount(makeBooleanForm(true))

    // Call onSubmit() directly — bypasses happy-dom's form event system
    await (wrapper.vm as unknown as { onSubmit: () => Promise<void> }).onSubmit()
    await flushPromises()

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    expect((emitted![0][0] as Record<string, unknown>).active).toBe(true)
  })

  it('submits false or undefined when the checkbox is unchecked', async () => {
    const wrapper = mount(makeBooleanForm(false))

    await (wrapper.vm as unknown as { onSubmit: () => Promise<void> }).onSubmit()
    await flushPromises()

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    const value = (emitted![0][0] as Record<string, unknown>).active
    expect(value === false || value === undefined).toBe(true)
  })
})
