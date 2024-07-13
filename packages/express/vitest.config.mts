import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        watch: false,
        reporters: 'verbose',
        typecheck: {
            // include: ['src/**/*.spec-d.ts'],
        }
    },
})