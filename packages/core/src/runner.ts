import { MiddlewareContext } from "../dist";
import { createContext } from "./context";
import type { Context, Middleware, MiddlewareListContext } from "./context";


export interface RunnerCallback<C extends Context>{
    (ctx: C): any
}

export interface Runner<C extends Context = Context> {
    context: C
    middlewares: Middleware[]
    push<M2 extends Middleware>(middleware: M2): Runner<C & MiddlewareContext<M2>>
    pushAll<M2 extends Middleware[]>(middlewares: M2): Runner<C & MiddlewareListContext<M2>>
    unshift<M2 extends Middleware>(middleware: M2): Runner<C & MiddlewareContext<M2>>
    run(cb: RunnerCallback<C>): Promise<any>
    use<M2 extends Middleware>(middleware: M2): Runner<C & MiddlewareContext<M2>>
    mount(cb: RunnerCallback<C>): () => Promise<any>

    // ts only
    infer<C2 extends Context, M extends Middleware[]>(): Runner<C2 & MiddlewareListContext<M>>
}

export function createRunner<C extends Context>(baseContext?: C): Runner<C> {
    const middlewares = [] as Middleware[]

    function push<M2 extends Middleware>(middleware: M2){
        middlewares.push(middleware)

        return this
    }

    function pushAll<M2 extends Middleware[]>(newMiddlewares: M2){
        middlewares.push(...newMiddlewares)

        return this
    }

    function unshift<M2 extends Middleware>(middleware: M2){
        middlewares.unshift(middleware)

        return this
    }

    function use<M2 extends Middleware>(middleware: M2){
        middlewares.push(middleware)

        return this
    }

    function mount(cb: RunnerCallback<C>){
        return async () => {
            const ctx = await createContext({
                baseContext,
                middlewares
            })
    
            return cb(ctx)

        }
    }

    async function run(cb: RunnerCallback<C>){
        const mounted = mount(cb)

        return mounted()
    }

    function infer<C2 extends Context, M extends Middleware>(){
        return this as Runner<C2 & MiddlewareContext<M>>
    }

    return {
        context: baseContext as C,
        middlewares,
        push,
        pushAll,
        unshift,
        run,
        use,
        mount,

        // ts only
        infer,
    }
}