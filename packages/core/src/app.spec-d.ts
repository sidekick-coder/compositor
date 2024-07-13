import { describe, it, expect, expectTypeOf } from 'vitest'
import { createApp, defineAppHandler } from './app'
import { createRunner } from './runner'

describe('app', () => {
    it('should run context have app handle base context', async () => {
        const app = createApp({
            middlewares: [],
            handler: () => {
                return createRunner({
                    requestId: undefined as unknown as string // this is defined on request lifecycle
                })
            }
        })

        app.get('/').run((ctx) => {
            expectTypeOf(ctx.requestId).toEqualTypeOf<string>()
        })
    })
    
    it('should run context have app handle middlewares context', async () => {
        const handler = () => createRunner()
            .use(async () => ({ country: 'BR' as 'BR' | 'USA' }))

        const app = createApp({
            middlewares: [],
            handler
        })

        app.get('/').run((ctx) => {
            expectTypeOf(ctx.country).toEqualTypeOf<'BR' | 'USA'>()
        })
    })

    it('should create handle using defineAppHandler', async () => {
        const handler = defineAppHandler(() => createRunner({
            requestId: undefined as unknown as string // this is defined on request lifecycle
        }))

        const app = createApp({
            middlewares: [],
            handler
        })

        app.get('/').run((ctx) => {
            expectTypeOf(ctx.requestId).toEqualTypeOf<string>()
        })
    })

    it('should have context form handle + global middlewares + local middlewares', async () => {
        const app = createApp({
            middlewares: [async () => ({ globalMiddleware: true })],
            handler: () => {
                return createRunner({ ctxHandle: true })
                    .push(async () => ({ handleMiddleware: true }))
            }
        })

        app.get('/')
            .use(async () => ({ localMiddleware: true }))
            .run((ctx) => {
                expectTypeOf(ctx.globalMiddleware).toEqualTypeOf<boolean>()

                expectTypeOf(ctx.ctxHandle).toEqualTypeOf<boolean>()
                expectTypeOf(ctx.handleMiddleware).toEqualTypeOf<boolean>()

                expectTypeOf(ctx.localMiddleware).toEqualTypeOf<boolean>()
            })
    })

})