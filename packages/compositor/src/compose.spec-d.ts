import { describe, it, expectTypeOf } from 'vitest'
import { compose } from './compose'

describe('compose', () => {
	it('should simple compose', async () => {

		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer' as 'admin' | 'customer' 
		})

		const make = (name: string)  => compose([() => ({ name }), addRole])

		const result = make('Jonny')

		expectTypeOf(result.name).toEqualTypeOf<string>()
		expectTypeOf(result.role).toEqualTypeOf<'admin' | 'customer'>()

	})

    it('should accept object and functions', () => {
        const addRole = (ctx: { name: string }) => ({
            role: ctx.name === 'Jonny' ? 'admin' : 'customer'
        })

        const make = (name: string) => compose([{ name }, addRole])

        const user = make('Jonny')

        expectTypeOf(user.name).toEqualTypeOf<string>()
        expectTypeOf(user.role).toEqualTypeOf<string>()
    })


	it('should compose promise', async () => {
		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer'
		})

		const make = (name: string) => compose.async([() => ({ name }), addRole])

		expectTypeOf(make).toEqualTypeOf<(name: string) => Promise<{ name: string } & { role: string }>>()

	})
})
