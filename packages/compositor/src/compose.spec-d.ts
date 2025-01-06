import { describe, it, expectTypeOf } from 'vitest'
import { compose } from './compose'

describe('compose', () => {
	it('should exetend simple compose', async () => {

		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer' as 'admin' | 'customer' 
		})

		const make = (name: string)  => compose([() => ({ name }), addRole])

		const result = make('Jonny')

		expectTypeOf(result.name).toEqualTypeOf<string>()
		expectTypeOf(result.role).toEqualTypeOf<'admin' | 'customer'>()

	})


	it('should exetend promise compose', async () => {
		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer'
		})

		const make = (name: string) => compose.async([() => ({ name }), addRole])

		expectTypeOf(make).toEqualTypeOf<(name: string) => Promise<{ name: string } & { role: string }>>()

	})


})
