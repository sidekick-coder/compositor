import { describe, it, expect } from 'vitest'
import { createContext } from './context'


describe('context', () => {
    it('should create context with property', async () => {
        const context = await createContext(
            async () => ({ user: 'John Doe' }),
        )

        expect(context).toEqual({ user: 'John Doe' })
    })

    it('should create context with multiple properties', async () => {
        const context = await createContext(
            async () => ({ user: 'John Doe' }),
            async () => ({ role: 'admin' }),
        )

        expect(context).toEqual({ user: 'John Doe', role: 'admin' })
    })
})