import { describe, it, expect } from 'vitest'
import { compose } from './compose'


describe('compose', () => {
    it('should exetend simple compose', async () => {
		const makeUser = (name: string) => {
			return {
				name,
			}
		}

		const makeUserWithRole = compose(makeUser, (name) => ({
			role: name === 'Jonny' ? 'admin' : 'customer'
		}))

		expect(makeUserWithRole('Jonny')).toEqual({
			name: 'Jonny',
			role: 'admin'
		})

    })

})
