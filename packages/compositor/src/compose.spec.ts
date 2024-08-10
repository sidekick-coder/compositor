import { describe, it, expect } from 'vitest'
import { compose, composeAsync } from './compose'


describe('compose', () => {
	it('should exetend simple compose', async () => {
		const makeUser = (name: string) => {
			return {
				name,
			}
		}

		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer'
		})


		const makeUserWithRole = compose(makeUser, [addRole])

		expect(makeUserWithRole('Jonny')).toEqual({
			name: 'Jonny',
			role: 'admin'
		})

		expect(makeUserWithRole('Jay')).toEqual({
			name: 'Jay',
			role: 'customer'
		})

	})

	it('should exetend multiple times', async () => {
		const makeUser = (name: string) => {
			return {
				name,
			}
		}

		const addRole = (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer'
		})

		const addIsAdmin = (name: string) => ({
			isAdmin: () => name === 'Jonny'
		})

		const makeAll = compose(makeUser, [addRole, addIsAdmin])

		const user = makeAll('Jonny')

		expect(user.name).toEqual('Jonny')
		expect(user.role).toEqual('admin')
		expect(user.isAdmin()).toEqual(true)
	})

	it('should exetend promise compose', async () => {
		const makeUser = async (name: string) => {
			return Promise.resolve({
				name,
			})
		}

		const addRole = async (name: string) => ({
			role: name === 'Jonny' ? 'admin' : 'customer'
		})


		const makeAll = composeAsync(makeUser, [addRole])

		const user = await makeAll('Jonny')

		expect(user.name).toEqual('Jonny')
		expect(user.role).toEqual('admin')

	})

})
