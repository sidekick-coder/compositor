import { describe, it, expectTypeOf } from 'vitest'
import { createRunner } from './runner'
import { MiddlewareListContext } from './context'

describe('runner', () => {
    it('should create simple runner', async () => {
        await createRunner({
            middlewares: [async () => ({ user: 'John Doe' })]
        })
        .run(ctx => {
            expectTypeOf(ctx.user).toEqualTypeOf<string>()
        })
    })
    
    it('should create runner with base context', async () => {
        await createRunner({
            baseContext: { version: '1.0.0' },
            middlewares: [async () => ({ user: 'John Doe' })]
        })
        .run(ctx => {
            expectTypeOf(ctx.user).toEqualTypeOf<string>()
            expectTypeOf(ctx.version).toEqualTypeOf<string>()
        })
    })
    
    it('should add middleware "use" method', async () => {
        await createRunner({
            middlewares: []
        })
        .use(async () => ({ user: 'John Doe' }))
        .run(ctx => {
            expectTypeOf(ctx.user).toEqualTypeOf<string>()
        })
    })

    it('should allow explicit define middleware context', async () => {
        await createRunner({
            middlewares: [async () => ({ first: 'John' })]
        })
        .use(async (ctx: { first: string }) => {
            expectTypeOf(ctx.first).toEqualTypeOf<string>()

            return {}
        })
    })
    
    it('should allow define based on array of middlewares', async () => {
        const middlewares = [
            async () => ({ first: 'John' }),
            async () => ({ second: 'Doe' })
        ]

        await createRunner({ middlewares })
            .use(async (ctx: MiddlewareListContext<typeof middlewares>) => {
                expectTypeOf(ctx.first).toEqualTypeOf<string>()
                expectTypeOf(ctx.second).toEqualTypeOf<string>()
            })
    })

})