import { describe, it, expectTypeOf } from 'vitest'
import { createContext } from './context.js'


describe('context', () => {
    it('should create context with basic type', async () => {
        const context = await createContext(
            async () => ({ user: 'John Doe' }),
        )

        expectTypeOf(context.user).toEqualTypeOf<string>()
    })
    
    it('should create context with a const type', async () => {
        const context = await createContext(
            async () => ({ role: 'admin' as 'admin' | 'user' }),
        )

        expectTypeOf(context.role).toEqualTypeOf<'admin' | 'user'>()
    })

    it('should create context with a union type', async () => {
        const context = await createContext(
            async () => ({ first: 'John' }),
            async () => ({ second: 'Doe' }),
            async () => ({ third: 'Smith' }),
        )

        expectTypeOf(context.first).toEqualTypeOf<string>()
        expectTypeOf(context.second).toEqualTypeOf<string>()
        expectTypeOf(context.third).toEqualTypeOf<string>()
    })

})