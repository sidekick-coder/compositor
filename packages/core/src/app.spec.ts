import { describe, it, expect } from 'vitest'
import { createApp, defineAppHandler } from './app'
import { createRunner } from './runner'

describe('app', () => {

    function makeHandler() {
        const routes = new Map<string, any>()

        const handler = defineAppHandler(({ method, path }) => {
            const runner = createRunner()

            runner.run = async (cb) => {
                const route = async () => {    
                    const handler = runner.mount(cb)
    
                    const result = await handler()
    
                    return result
                }

                routes.set(`${method}:${path}`, route)
            }

            return runner
        })

        const client = (method: string, path: string) => {
            const fn = routes.get(`${method}:${path}`)

            return fn()
        }

        return { handler, routes, client }
    }

    it('should create simple api', async () => {
        expect.assertions(1)

        const { handler, client } = makeHandler()

        const api = createApp({
            handler,
            middlewares: []
        })

        api.get('/').run(() => ({ message: 'Hello' }))

        const result = await client('get', '/')

        expect(result).toEqual({ message: 'Hello' })

    })

    it('should have global middleware context', async () => {
        expect.assertions(1)

        const api = createApp({
            handler: () => createRunner(),
            middlewares: [
                () => ({ requestId: '123' })
            ],
        })

        await api.get('/').run(ctx => {
            expect(ctx.requestId).toEqual('123')
        })
    })
    
    it('should have global middleware context with multiples middlewares', async () => {
        expect.assertions(1)

        const api = createApp({
            handler: () => createRunner(),
            middlewares: [
                () => ({ requestId: '123' }),
                () => ({ user: 'John' }),
            ],
        })

        await api.get('/').run(ctx => {
            expect(ctx.requestId).toEqual('123')
            expect(ctx.user).toEqual('John')
        })
    })

    it('should have handler base context', async () => {
        expect.assertions(1)

        const api = createApp({
            middlewares: [],
            handler: () => createRunner({ baseContext: 'handle' }),
        })

        await api.get('/').run(ctx => {
            expect(ctx.baseContext).toEqual('handle')
        })
    })
    
    it('should have handler middlewares context', async () => {
        expect.assertions(1)

        const api = createApp({
            middlewares: [],
            handler: () => createRunner().use(() => ({ middlewareContext: 'handle' })),
        })

        await api.get('/').run(ctx => {
            expect(ctx.middlewareContext).toEqual('handle')
        })
    })

    it('should have local middleware context', async () => {
        expect.assertions(1)

        const api = createApp({
            handler: () => createRunner(),
            middlewares: [],
        })

        await api.get('/')
            .use(() => ({ user: 'John' }))
            .run(ctx => {
                expect(ctx.user).toEqual('John')
            })
    })

})