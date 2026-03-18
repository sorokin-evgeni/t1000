// @vitest-environment jsdom
import { it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DynamicForm from '../../src/core/components/DynamicForm.vue'
import type { JSONSchema } from '../../src/core/types/schema'

// Fields are registered via tests/setup.ts

const schema: JSONSchema = {
  type: 'object',
  title: 'My Form',
  properties: {
    subscribe: {
      type: 'boolean',
      title: 'Subscribe to newsletter',
    },
  },
}

it('чекбокс при сабмите передаёт true', async () => {
  vi.useFakeTimers()
  const wrapper = mount(DynamicForm, { props: { schema }, attachTo: document.body })

  wrapper.find('input[type="checkbox"]').element.click()
  await vi.runAllTimersAsync()
  await flushPromises()

  ;(wrapper.find('form').element as HTMLFormElement).requestSubmit()
  await vi.runAllTimersAsync()
  await flushPromises()

  const submitted = wrapper.emitted('submit')
  expect(submitted).toBeTruthy()
  expect(submitted![0][0]).toEqual({ subscribe: true })

  wrapper.unmount()
  vi.useRealTimers()
})
