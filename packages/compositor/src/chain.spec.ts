
import { describe, it, expect } from 'vitest'
import { Chain, createChain } from './chain'
import { Context } from './context'

describe('createChain', () => {
    it('should create simple chain', () => {

        interface MyChain extends Chain<Context> {
            getRole: (name: string) => { role: 'admin' | 'customer' }
        }

        const chain = createChain<Context, MyChain>({
            getRole(name) {
                return { role: name === 'Jonny' ? 'admin' : 'customer' }
            }
        })


        expect(chain.getRole('Jonny')).toEqual({ role: 'admin' })
        expect(chain.getRole('hello')).toEqual({ role: 'customer' })
    })


    it('should modify context', () => {
        interface Request<C extends Context> extends Chain<C> {
            params<T extends Record<string, any>>(data: T): Request<C & { params: T }>
            query<T extends Record<string, any>>(data: T): Request<C & { query: T }>
            handle(cb: (ctx: C) => void): void
        }

        const chain = createChain<Context, Request<Context>>({
            params(data) {
                return this.use(() => ({ params: data }))
            },
            query(data) {
                return this.use(() => ({ query: data }))
            },
            handle(cb) {
                cb(chain.mount())
            }
        })

        chain.handle(ctx => {
            expect(ctx.params).toEqual(undefined)
        })


        chain.params({ id: 1 }).handle(ctx => {
            expect(ctx.params).toEqual({ id: 1 })
        })

        chain.query({ page: 1 }).handle(ctx => {
            expect(ctx.query).toEqual({ page: 1 })
        })


    })


})
