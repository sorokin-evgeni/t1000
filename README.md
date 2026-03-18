# Dynamic Form Library

Библиотека для построения динамических форм на основе JSON Schema. Получает схему — рендерит готовую форму с валидацией, полями нужных типов и поддержкой вложенных объектов и массивов.

**Storybook:** https://sorokin-evgeni.github.io/t1000/

**Стек:** Vue 3 · vee-validate · yup · TypeScript

---

## Возможности

- Автоматический рендер формы из JSON Schema (draft-07)
- 8 встроенных типов полей: текст, число, булево, select, textarea, дата, массив, вложенный объект
- Валидация через yup: `required`, `minLength`/`maxLength`, `minimum`/`maximum`, `pattern`, `format: email`, `minItems`/`maxItems`
- Режим `readonly` — отображение данных без возможности редактирования
- Поддержка `v-model` для синхронизации состояния формы
- Расширяемый реестр типов полей — можно зарегистрировать свой тип одной строкой

---

## Установка

```bash
npm install
```

---

## Использование

### Базовый пример

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DynamicForm } from './src/index'
import type { JSONSchema } from './src/index'

const schema: JSONSchema = {
  type: 'object',
  title: 'Профиль',
  required: ['name', 'age'],
  properties: {
    name: { type: 'string', title: 'Имя', minLength: 2 },
    age:  { type: 'integer', title: 'Возраст', minimum: 0 },
    bio:  { type: 'string', title: 'О себе', format: 'textarea' },
  },
}

const formData = ref({})

function onSubmit(values: Record<string, unknown>) {
  console.log(values)
}
</script>

<template>
  <DynamicForm
    :schema="schema"
    v-model="formData"
    submit-label="Сохранить"
    @submit="onSubmit"
  />
</template>
```

### Режим readonly

```vue
<DynamicForm :schema="schema" :model-value="formData" :readonly="true" />
```

### Поддерживаемые типы полей

| JSON Schema                          | Компонент      |
|--------------------------------------|----------------|
| `type: string`                       | TextField      |
| `type: string, format: textarea`     | TextareaField  |
| `type: string, format: date`         | DateField      |
| `type: string, enum: [...]`          | SelectField    |
| `type: number` / `type: integer`     | NumberField    |
| `type: boolean`                      | BooleanField   |
| `type: array`                        | ArrayField     |
| `type: object`                       | NestedObjectField |

### Регистрация своего типа поля

```ts
import { fieldRegistry } from './src/index'
import MyCustomField from './MyCustomField.vue'
import * as yup from 'yup'

fieldRegistry.register({
  matches: schema => schema.format === 'phone',
  component: MyCustomField,
  buildProps: schema => ({ /* доп. пропы */ }),
  buildValidator: (schema, label, isRequired) => {
    let v = yup.string().label(label)
    if (isRequired) v = v.required()
    return v
  },
  initialValue: () => '',
})
```

Регистрации проверяются в порядке добавления — более специфичные должны идти раньше.

---

## Storybook

### Локальный запуск

Интерактивная документация со всеми историями и Playground для ввода произвольной JSON Schema:

```bash
npm run storybook
```

Откроется на [http://localhost:6006](http://localhost:6006).

Доступные истории:
- **Registration** — форма регистрации с обязательными полями
- **Profile** — профиль с вложенным объектом (адрес)
- **Payment** — платёжная форма с массивами и датами
- **Survey** — опрос с enum-полями
- **Playground** — вводите свою JSON Schema прямо в браузере и видите живую форму

Сборка статики Storybook:

```bash
npm run build-storybook
```

---

## Тесты

```bash
npm test          # запуск один раз
npm run test:watch  # watch-режим
```

Покрытие: реестр полей, утилиты (`labelUtils`, `initialValues`, `schemaToYup`), регистрации всех встроенных типов.
