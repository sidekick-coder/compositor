import { describe, it, expect } from 'vitest'
import { createRunner } from './runner'

describe('runner', () => {
    it('should create simple runner', async () => {
        expect.assertions(1)

        await createRunner({
            middlewares: [async () => ({ user: 'John Doe' })]
        })
        .run(ctx => {
            expect(ctx).toEqual({ user: 'John Doe' })
        })
    })

    it('should create runner with base context', async () => {
        expect.assertions(2)

        await createRunner({
            baseContext: { version: '1.0.0' },
            middlewares: [async () => ({ user: 'John Doe' })]
        })
        .run(ctx => {
            expect(ctx.user).toEqual('John Doe')
            expect(ctx.version).toEqual('1.0.0')
        })
    })
    
    it('should add middleware "use" method', async () => {
        expect.assertions(1)

        await createRunner({
            middlewares: []
        })
        .use(async () => ({ user: 'John Doe' }))
        .run(ctx => {
            expect(ctx).toEqual({ user: 'John Doe' })
        })
    })

})