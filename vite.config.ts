import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DynamicFormLibrary',
      fileName: (format) => `dynamic-form-library.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vee-validate', 'yup'],
      output: {
        globals: {
          vue: 'Vue',
          'vee-validate': 'VeeValidate',
          yup: 'Yup',
        },
      },
    },
  },
})
