import { describe, it, expectTypeOf } from 'vitest'
import { createApp } from './app'
import express, { Request, Response } from 'express'
import { MiddlewareContext, MiddlewareListContext } from '@sugar-middleware/core'

describe('app', () => {
    it('should request & response be defined in base context', async () => {
        const expressApp = express()

        const app = createApp({
            expressApp,
            middlewares: [
                async (ctx) => {
                    expectTypeOf(ctx.request).toEqualTypeOf<Request>()
                    expectTypeOf(ctx.response).toEqualTypeOf<Response>()
                }
            ],
        })

        app.createRunner('get', '/').run((ctx) => {
            expectTypeOf(ctx.request).toEqualTypeOf<Request>()
            expectTypeOf(ctx.response).toEqualTypeOf<Response>()
        })
    })

    it('should run context have global middleware context', async () => {
        const expressApp = express()

        const app = createApp({
            expressApp,
            middlewares: [
                async (ctx) => ({
                    id: Number(ctx.request.params.id)
                })
            ],
        })

        app.createRunner('get', '/products/:id').run(({ id }) => {
            expectTypeOf(id).toEqualTypeOf<number>()
        })
    })

    it('should create simple app with get request', async () => {
        const expressApp = express()

        const app = createApp({
            expressApp,
            middlewares: [],
        })

        app.createRunner('get', '/')
            .use(async () => ({ user: "John" }))
            .use(async () => ({ role: "admin" as 'admin' | 'user' }))
            .run(ctx => {
                expectTypeOf(ctx.user).toEqualTypeOf<string>()
                expectTypeOf(ctx.role).toEqualTypeOf<'admin' | 'user'>()
            })
    })

    it('should allow infer middleware context type', async () => {
        const expressApp = express()

        const app = createApp({
            expressApp,
            middlewares: [async () => ({ first: 'John' })],
        })

        app
            .createRunner('get', '/')
            .use(async (ctx: { first: string }) => {
                expectTypeOf(ctx.first).toEqualTypeOf<string>()

                return {}
            })
    })

    it('should infer middleware context type based middleware', async () => {
        const auth = async () => ({ user: 'John' })

        const expressApp = express()

        const app = createApp({
            expressApp,
            middlewares: [auth],
        })

        app
            .createRunner('get', '/')
            .use(async (ctx: MiddlewareContext<typeof auth>) => {
                expectTypeOf(ctx.user).toEqualTypeOf<string>()
            })
    })

    it('should infer middleware context type based on array of middlewares', async () => {
        const middlewares = [
            async () => ({ first: 'John' }),
            async () => ({ second: 'Doe' })
        ]

        const expressApp = express()

        const app = createApp({
            expressApp,
            middlewares,
        })

        app
            .createRunner('get', '/')
            .use(async (ctx: MiddlewareListContext<typeof middlewares>) => {
                expectTypeOf(ctx.first).toEqualTypeOf<string>()
                expectTypeOf(ctx.second).toEqualTypeOf<string>()
            })
    })
})