import { describe, it, expectTypeOf } from 'vitest'
import { compose } from './compose'


describe('compose', () => {
	it('should exetend simple compose', async () => {
		const makeUser = (name: string) => {
			return {
				name,
			}
		}

		const makeUserWithRole = compose(makeUser, (name) => ({
			role: name === 'Jonny' ? 'admin' : 'customer' as 'admin' | 'customer'
		}))

		const result = makeUserWithRole('Jonny')

		expectTypeOf(result.name).toEqualTypeOf<string>()
		expectTypeOf(result.role).toEqualTypeOf<'admin' | 'customer'>()

	})

})
