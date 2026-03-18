<template>
  <form
    class="dynamic-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <NestedObjectField v-if="schema.properties" :schema="schema" :readonly="readonly" />

    <button v-if="!readonly" type="submit" class="submit-button">
      {{ submitLabel }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { buildInitialValues } from '../utils/initialValues'
import { schemaToYup } from '../utils/schemaToYup'
import type { JSONSchema } from '../types/schema'
import NestedObjectField from './NestedObjectField.vue'

interface Props {
  schema: JSONSchema
  modelValue?: Record<string, unknown>
  readonly?: boolean
  submitLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  readonly: false,
  submitLabel: 'Submit',
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  submit: [value: Record<string, unknown>]
}>()

const validationSchema = computed(() => schemaToYup(props.schema))
const initialValues = computed(() => buildInitialValues(props.schema, props.modelValue))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { values, handleSubmit: veeHandleSubmit, setValues } = useForm<any>({
  validationSchema,
  initialValues,
})

// Sync external modelValue changes into the form (e.g. readonly mode, prefill)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) setValues(buildInitialValues(props.schema, newVal), false)
  },
  { deep: true },
)

// Expose form state via v-model
watch(
  values,
  (newValues) => {
    emit('update:modelValue', { ...(newValues as Record<string, unknown>) })
  },
  { deep: true },
)

const handleSubmit = veeHandleSubmit((formValues) => {
  emit('submit', formValues as Record<string, unknown>)
})
</script>

<style scoped>
.dynamic-form {
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 560px;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  font-family: system-ui, -apple-system, sans-serif;
  color: #ffffff;
  background-color: #1a1a2e;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
  margin-top: 8px;
  outline: none;
}

.submit-button:hover {
  background-color: #2d2d4e;
}

.submit-button:focus {
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.4);
}

.submit-button:active {
  transform: translateY(1px);
}
</style>
