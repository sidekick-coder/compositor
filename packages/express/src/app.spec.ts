import { describe, it, expect } from 'vitest'
import { createApp } from './app'
import express from 'express'
import supertest from 'supertest'

describe('app', () => {

    function makeExpressApp(){
        const expressApp = express()
        
        const client = supertest(expressApp)

        return { expressApp, client }
    }

    it.each(['get', 'post', 'put', 'patch'] as const)('should create simple app with %s request', async (method) => {
        const { expressApp, client } = makeExpressApp()

        const app = createApp({
            expressApp,
            middlewares: [],
        })

        app[method]('/').run(() => ({
            message: "Hello word"
        }))

        const response = await client[method]('/')

        expect(response.body).toEqual({ message: "Hello word" })
    })

    it('should create request with global middleware', async () => {
        const { expressApp, client } = makeExpressApp()

        const app = createApp({
            expressApp,
            middlewares: [
                async (ctx) => ({
                    id: Number(ctx.request.params.id)
                })
            ],
        })

        app.get('/products/:id').run(({ id }) => {
            return { id }
        })

        const response = await client.get('/products/1')

        expect(response.body).toEqual({ id: 1 })
    })

    it('should create request with local middleware', async () => {
        expect.assertions(1)

        const { expressApp, client } = makeExpressApp()

        const app = createApp({
            expressApp,
            middlewares: [],
        })

        app.get('/products/:id')
            .use(async (ctx) => ({ id: Number(ctx.request.params.id) }))
            .run(({ id }) => {
                expect(id).toEqual(1)
            })

        await client.get('/products/1')
    })

    
})