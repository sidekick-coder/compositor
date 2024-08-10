import { describe, it, expectTypeOf } from 'vitest'
import { compose, composeAsync } from './compose'

describe('compose', () => {
	it('should exetend simple compose', async () => {
		const makeUser = (name: string) => {
			return {
				name,
			}
		}

		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer' as 'admin' | 'customer' 
		})

		const makeAll = compose(makeUser, [addRole])

		const result = makeAll('Jonny')

		expectTypeOf(result.name).toEqualTypeOf<string>()
		expectTypeOf(result.role).toEqualTypeOf<'admin' | 'customer'>()

	})

	it('should exetend promise compose', async () => {
		const makeUser = async (name: string) => {
			return Promise.resolve({
				name,
			})
		}

		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer'
		})

		const makeAll = composeAsync(makeUser, [addRole])
		
		expectTypeOf(makeAll).toEqualTypeOf<(name: string) => Promise<{ name: string } & { role: string }>>()

	})


})
