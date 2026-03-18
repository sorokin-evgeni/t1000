import type { Preview } from '@storybook/vue3'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Dynamic Form', ['Playground', '*']],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'gray', value: '#f8fafc' },
      ],
    },
  },
}

export default preview
