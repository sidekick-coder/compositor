import { describe, it, expect } from 'vitest'
import { createApi } from './api'

describe('api', () => {
    it('should create simple api', async () => {
        expect.assertions(1)

        let handler = async () => {}

        const api = createApi({
            middlewares: [
                async () => ({ })
            ],
            register: (route) => {
                handler = route.handler
            }
        })

        api.get('/').run(() => "Hello World")

        expect(await handler()).toEqual("Hello World")
    })

    it('should create simple api with middlewares', async () => {
        expect.assertions(1)

        let handler = async () => {}

        const api = createApi({
            middlewares: [
                async () => ({ user: 'Johnny' })
            ],
            register: (route) => {
                handler = route.handler
            }
        })

        api.get('/').run(ctx => {
            expect(ctx).toEqual({ user: 'Johnny' })
        })

        await handler()
    })

    it('should create simple api with multiple middlewares', async () => {
        expect.assertions(1)

        let handler = async () => {}

        const api = createApi({
            middlewares: [
                async () => ({ user: 'Johnny' }),
                async () => ({ role: 'admin' as 'admin' | 'user' })
            ],
            register: (route) => {
                handler = route.handler
            }
        })

        api.get('/').run(ctx => {
            expect(ctx).toEqual({ user: 'Johnny', role: 'admin' })
        })

        await handler()
    })

    it('should request has individual context', async () => {
        expect.assertions(2)

        let handler = async () => {}

        const api = createApi({
            middlewares: [],
            register: (route) => {
                handler = route.handler
            }
        })

        api.get('/')
            .use(async () => ({ params: { id: 1 }}))
            .run(ctx => expect(ctx).toEqual({ params: { id: 1 } }))

        await handler()

        api.get('/2').run(ctx => expect(ctx).toEqual({}))

        console.log(handler)

        await handler()

    })

})