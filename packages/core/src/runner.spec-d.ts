import { describe, it, expectTypeOf } from 'vitest'
import { createRunner } from './runner'
import type { ModifierListContext } from './context'

describe('runner', () => {
	it('should create simple runner', async () => {
		createRunner()
			.push(async () => ({ user: 'John Doe' }))
			.run(ctx => {
				expectTypeOf(ctx.user).toEqualTypeOf<string>()
			})
	})

	it('should create runner with base context', async () => {
		createRunner({ version: '1.0.0' })
			.push(async () => ({ user: 'John Doe' }))
			.run(ctx => {
				expectTypeOf(ctx.user).toEqualTypeOf<string>()
				expectTypeOf(ctx.version).toEqualTypeOf<string>()
			})
	})

	it('should add middleware "use" method', async () => {
		createRunner()
			.use(async () => ({ user: 'John Doe' }))
			.run(ctx => {
				expectTypeOf(ctx.user).toEqualTypeOf<string>()
			})
	})

	it('should allow explicit define middleware context', async () => {
		createRunner({
			middlewares: [async () => ({ first: 'John' })]
		})
			.use(async (ctx: { first: string }) => {
				expectTypeOf(ctx.first).toEqualTypeOf<string>()

				return {}
			})
	})

	it('should pushAll add multiple middlewares', async () => {
		await createRunner({ middlewares: [] })
			.pushAll([
				async () => ({ first: 'John' }),
				async () => ({ second: 'Doe' })
			])
			.run(ctx => {
				expectTypeOf(ctx.first).toEqualTypeOf<string>()
				expectTypeOf(ctx.second).toEqualTypeOf<string>()
			})
	})

	it('should allow define based on array of middlewares', async () => {
		const middlewares = [
			async () => ({ first: 'John' }),
			async () => ({ second: 'Doe' })
		]

		createRunner()
			.pushAll(middlewares)
			.use(async (ctx: ModifierListContext<typeof middlewares>) => {
				expectTypeOf(ctx.first).toEqualTypeOf<string>()
				expectTypeOf(ctx.second).toEqualTypeOf<string>()
			})
	})
})
