import { Context, createApp } from '@sugar-middleware/core';
import { describe, expectTypeOf, it } from 'vitest';
import express from 'express';
import { createHandler } from './handler';

describe('handler', () => {
    const expressApp = express();
    const handler = createHandler(expressApp);
    
    it('should have express properties in context', async () => {
        const app = createApp({
            handler,
            middlewares: []
        })

        app.get('/').run((ctx) => {
            expectTypeOf(ctx.request).toEqualTypeOf<express.Request>()
            expectTypeOf(ctx.response).toEqualTypeOf<express.Response>()
        })
    });
    
    it('should have express global middlewares in context', async () => {
        const app = createApp({
            handler,
            middlewares: [
                () => ({ requestId: Date.now() }),
                () => ({ user: 'John' }),
                // empty return
                () => ({} as Context)
            ]
        })

        app.get('/').run((ctx) => {
            expectTypeOf(ctx.requestId).toEqualTypeOf<number>()
            expectTypeOf(ctx.user).toEqualTypeOf<string>()
        })
    });
});