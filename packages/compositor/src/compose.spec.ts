import { describe, it, expect } from 'vitest'
import { compose } from './compose'


describe('compose', () => {
	it('should compose simple', async () => {
		const addRole = (ctx: { name: string }) => ({
			role: ctx.name === 'Jonny' ? 'admin' : 'customer'
		})

		const make = (name: string) => compose([() => ({ name }), addRole])

		expect(make('Jonny')).toEqual({
			name: 'Jonny',
			role: 'admin'
		})

		expect(make('Jay')).toEqual({
			name: 'Jay',
			role: 'customer'
		})
	})

    it('should accept object and functions', () => {
        const addRole = (ctx: { name: string }) => ({
            role: ctx.name === 'Jonny' ? 'admin' : 'customer'
        })

        const make = (name: string) => compose([{ name }, addRole])

        const user = make('Jonny')

        expect(user.name).toEqual('Jonny')
        expect(user.role).toEqual('admin')
    })

	it('should exetend multiple times', async () => {

		const addRole = (ctx: { name: string }) => ({
			role: ctx.name === 'Jonny' ? 'admin' : 'customer'
		})

        const addIsAdmin = (ctx: { role: string }) => ({
            isAdmin: ctx.role === 'admin',
        })

		
		const make = (name: string) => compose([() => ({ name }), addRole, addIsAdmin])

		const user = make('Jonny')

		expect(user.name).toEqual('Jonny')
		expect(user.role).toEqual('admin')
		expect(user.isAdmin).toEqual(true)
	})

	it('should exetend promise compose', async () => {
		const addRole = async (ctx: { name: string }) => ({
			role: ctx.name === 'Jonny' ? 'admin' : 'customer'
		})

		const make = (name: string) => compose.async([() => ({ name }), addRole])

		const user = await make('Jonny')

		expect(user.name).toEqual('Jonny')
		expect(user.role).toEqual('admin')

	})

})
