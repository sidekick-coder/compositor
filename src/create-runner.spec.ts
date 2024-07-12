import { describe, it, expect } from 'vitest'
import { createRunner } from './create-runner'

describe('runner', () => {
    it('should create simple runner', async () => {
        expect.assertions(1)

        const runner = createRunner(async () => ({ user: 'John Doe' }))

        await runner.run(ctx => {
            expect(ctx).toEqual({ user: 'John Doe' })
        })
    })

})