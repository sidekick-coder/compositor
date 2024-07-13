import { Context, Middleware, type MiddlewareListContext } from "./context";
import { Runner } from "./runner";


export type CreateApiRunnerMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface AppHandlerOptions {
    method: CreateApiRunnerMethod
    path: string
}

export interface AppHandler<R extends Runner = Runner> {
    (options: AppHandlerOptions): R
}

export interface CreateApiOptions<H extends AppHandler = AppHandler, M extends Middleware[] = Middleware[]> {
    handler: H
    middlewares: M
    onError?: (error: Error) => void
}

export function defineAppHandler<R extends Runner>(cb: AppHandler<R>){
    return cb
}

export function createApp<H extends AppHandler, M extends Middleware[]>({ handler, middlewares }: CreateApiOptions<H, M>){
    function get(path: string){
        const runner = handler({ method: 'get', path })

        runner.pushAll(middlewares)

        return runner.infer<ReturnType<H>['context'], M>()
    }
    
    return {
        handler,
        get
    }
}