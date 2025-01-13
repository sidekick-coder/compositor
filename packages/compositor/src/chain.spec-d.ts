
import { describe, it, expectTypeOf } from 'vitest'
import { Chain, createChain } from './chain'
import { Context } from './context'

describe('createChain', () => {
	it('should create simple chain', () => {

        interface MyChain extends Chain<Context> {
            getRole: (name: string) => { role: 'admin' | 'customer' }
        }

        const chain = createChain<Context, MyChain>({
            getRole(name){
                return { role: name === 'Jonny' ? 'admin' : 'customer' }
            }
        })


        expectTypeOf(chain.getRole).toEqualTypeOf<(name: string) => { role: 'admin' | 'customer' }>()
	})

    it('should return correct type for this', () => {
        interface MyChain extends Chain<Context> {
            setRole: (name: string) => MyChain
        }

        const chain = createChain<Context, MyChain>({
            setRole(){
                return this
            }
        })

        expectTypeOf(chain.setRole('hello')).toEqualTypeOf<MyChain>()
    })

    it('should modify context', () => {
        interface Request<C extends Context> extends Chain<C> {
            params<T extends Record<string, any>>(data: T): Request<C & { params: T }>
            query<T extends Record<string, any>>(data: T): Request<C & { query: T }>
            handle(cb: (ctx: C) => void): void
        }

        const chain = createChain<Context, Request<Context>>({
            params(){
                return this.use(() => ({ params: {} }))
            },
            query(){
                return this.use(() => ({ query: {} }))
            },
            handle(ctx){
                console.log(ctx)
            }
        })

        expectTypeOf(chain.handle).toEqualTypeOf<(cb: (ctx: Context) => void) => void>()

        const request = chain.params({ id: 1 })

        expectTypeOf(request.handle).toEqualTypeOf<(cb: (ctx: Context & { params: { id: number } }) => void) => void>()

        const request2 = request.query({ page: 1 })

        expectTypeOf(request2.handle).toEqualTypeOf<(cb: (ctx: Context & { params: { id: number } } & { query: { page: number } }) => void) => void>()
    })


})
