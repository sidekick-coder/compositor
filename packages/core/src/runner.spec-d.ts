import { describe, it, expectTypeOf } from 'vitest'
import { createRunner } from './runner'

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

})