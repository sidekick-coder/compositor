import { describe, it, expectTypeOf } from 'vitest'
import { createContext } from './context.js'


describe('context', () => {
    it('should create simple context type', async () => {
        const context = await createContext({
            middlewares: [
                async () => ({ user: 'John Doe' })
            ]
        })

        expectTypeOf(context).toEqualTypeOf<{ user: string }>()
    })
    
    it('should create context with a const type', async () => {
        const context = await createContext({
            middlewares: [
                async () => ({ role: 'admin' as 'admin' | 'user' })
            ]
        })

        expectTypeOf(context.role).toEqualTypeOf<'admin' | 'user'>()
    })

    it('should create context with a union type', async () => {
        const context = await createContext({
            middlewares: [
                async () => ({ first: 'John' }),
                async () => ({ second: 'Doe' }),
                async () => ({ third: 'Smith' })
            ]
        })

        expectTypeOf(context.first).toEqualTypeOf<string>()
        expectTypeOf(context.second).toEqualTypeOf<string>()
        expectTypeOf(context.third).toEqualTypeOf<string>()
    })

})