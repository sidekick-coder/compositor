import express from 'express';
import { Context, createApp } from '@sugar-middleware/core';
import { createHandler, ExpressAppContext } from '@sugar-middleware/express';

const expressApp = express();

const handler = createHandler(expressApp);

const app = createApp({
    handler,
    // global middlewares
    middlewares: [
        () => ({ requestId: Date.now() }),
        (ctx: ExpressAppContext & { requestId: number }) => {
            console.log({
                message: 'New request',
                requestId: ctx.requestId,
                method: ctx.method,
                path: ctx.path,
                url: ctx.request.url,
            })

            return {} as Context
        }
    ]
})

app.get('/')
    .run((ctx) => {
        return{
            requestId: ctx.requestId,
            message: 'Hello World 2',
        }
    })

app.get('*').run(() => ({
    message: 'Not Found'
}))

expressApp.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});