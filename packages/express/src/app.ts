import type { Application, Request, Response } from "express";
import { createRunner } from "core";

type Methods = 'get' | 'post' | 'put' | 'patch' | 'delete'



interface BaseContext {
    request: Request
    response: Response
}

interface ExpressMiddleware {
    (context: BaseContext & Record<string, any>): Promise<any>
}

interface Options<M extends ExpressMiddleware[]>{
    expressApp: Application
    middlewares: M
}

export function createApp<M extends ExpressMiddleware[]>({ expressApp, middlewares }: Options<M>){

    function createExpressRunner(method: Methods, path: string){
        const runner = createRunner({
            middlewares,
            baseContext: {} as BaseContext
        })
        
        runner.run = async (cb) => {            
            expressApp[method](path, async (request, response) => {

                runner.unshift(async () => ({ request, response }))

                const handler = runner.mount(cb)

                const result = await handler()

                return response.send(result)
            })
        }

        return runner
    }

    function get(path: string){
        return createExpressRunner('get', path)
    }

    function post(path: string){
        return createExpressRunner('post', path)
    }

    function put(path: string){
        return createExpressRunner('put', path)
    }

    function patch(path: string){
        return createExpressRunner('patch', path)
    }

    function del(path: string){
        return createExpressRunner('delete', path)
    }



    return {
        createRunner: createExpressRunner,
        get,
        post,
        put,
        patch,
        del,
        delete: del
    }
}