import { createRunner, defineAppHandler } from '@sugar-middleware/core'
import type { Application, Request, Response } from 'express'

export interface ExpressAppContext {
    request: Request
    response: Response
    method: string
    path: string
}


export function createHandler(expressApp: Application){
    return defineAppHandler(({ method, path }) => {
        const runner = createRunner({} as ExpressAppContext)

        runner.run = async (cb) => {
            expressApp[method](path, async (request, response) => {

                const clone = runner.clone()
        
                clone.unshift(async () => ({
                    request,
                    response,
                    method,
                    path
                }))
        
                const handler = clone.mount(cb)
        
                const result = await handler()
        
                return response.send(result)
            })
        }

        return runner
    })
}