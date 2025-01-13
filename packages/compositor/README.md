# Compositor

Functions & utilities to create compositions functions, with typescript friendly interfaces

## Compose

This function merge objects and functions into a single object with the correct type inference


### Simple usage

```ts
const addRole = (ctx: any) => ({
    role: ctx,name === 'Jonny' ? 'admin' : 'customer'
})

const addIsAdmin = (ctx: any) => ({
    isAdmin: () => ctx.name === 'Jonny'
})

const makeUser = (name: string) => compose([addRole, addIsAdmin])

const user = makeUser('Johnny')

user.name // string
user.role // string
user.isAdmin // () => boolean

```

### Promises
```ts
const addRole = async (ctx: any) => ({
    role: ctx,name === 'Jonny' ? 'admin' : 'customer'
})

const addIsAdmin = async (ctx: any) => ({
    isAdmin: () => ctx.name === 'Jonny'
})

const makeUser = (name: string) => compose.async([addRole, addIsAdmin])

const user = await makeUser('Johnny')

user.name // string
user.role // string

```

## Chain 

This function if to contruct chainable functions with custom methods, useful to create factories and similar patterns

```ts
import { createChain, compose } from 'compositor'
import * as v from 'valibot'
import express from 'express'

const app = express()

interface Request<C extends Context> extends Chain<C> {
    params<T extends Record<string, any>>(entrise: v.ObjectEntries): Request<C & { params: v.InferOutput<ObjectSchema<T, undefined>> }>
    query<T extends Record<string, any>>(entries: v.ObjectEntries): Request<C & { query: v.InferOutput<ObjectSchema<T, undefined>> }>
    handle(cb: (ctx: C) => void): void
}

const request = (method: string, path: string) = () => {
    const chain = createChain<Context, Request<Context>>({
        params(entries) {
            return chain.use((ctx) => ({ params: v.parse(v.object(entries), ctx.request.params) }))
        },
        query(entries) {
            return chain.use(() => ({ query: v.parse(v.object(entries), ctx.request.query) }))
        },
        handle(cb) {
            app[method](path, (request, response) => {
                const ctx = compose([{ request, response }, ...chain.modifiers])

                cb(ctx)
            })
        }
    })

    return chain

}

request('get', '/user')
    .params({
        id: v.number()
    })
    .query({
        name: v.string()
    })
    .handle(({ query, params }) => {
        console.log(params.id) // number
        console.log(query.name) // string

        ctx.response.json({ ok: true, name: query.name, id: params.id })
    })
```
