import { describe, it, expect } from 'vitest'
import { createContext } from './context'


describe('context', () => {
    it('should create simple context', async () => {
        const context = await createContext({
            modifiers: [
                async () => ({ user: 'John Doe' }),
            ]
        })

        expect(context).toEqual({ user: 'John Doe' })
    })

    it('should create context with multiple properties', async () => {
        const context = await createContext({
            modifiers: [
                async () => ({ user: 'John Doe' }),
                async () => ({ role: 'admin' }),
            ]
        })

        expect(context).toEqual({ user: 'John Doe', role: 'admin' })
    })

    it('should create context with base context', async () => {
        const context = await createContext({
            initial: { version: '1.0.0' },
            modifiers: [
                async () => ({ user: 'John' })
            ]
        })

        expect(context).toEqual({ version: '1.0.0', user: 'John' })
    })
})
