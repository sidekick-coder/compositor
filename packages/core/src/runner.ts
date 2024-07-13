import { createContext } from "./context";
import type { Context, ContextOptions, Middleware, MiddlewareListContext } from "./context";

export type Runner<C extends Context, M extends Middleware[]> = ReturnType<typeof createRunner<C, M>>

interface RunnerCallback<C extends Context, M extends Middleware[]>{
    (ctx: C & MiddlewareListContext<M>): any
}

export function createRunner<C extends Context, M extends Middleware[]>(options: ContextOptions<C, M>){
    const middlewares = options.middlewares.slice() as M

    function push<M2 extends Middleware>(middleware: M2){
        middlewares.push(middleware)

        return this as ReturnType<typeof createRunner<C, [...M, M2]>>
    }

    function unshift<M2 extends Middleware>(middleware: M2){
        middlewares.unshift(middleware)

        return this as ReturnType<typeof createRunner<C, [M2, ...M]>>
    }

    function use<M2 extends Middleware>(middleware: M2){
        middlewares.push(middleware)

        return this as ReturnType<typeof createRunner<C, [...M, M2]>>
    }

    function mount(cb: RunnerCallback<C, M>){
        return async () => {
            const ctx = await createContext({
                baseContext: options.baseContext,
                middlewares
            })
    
            return cb(ctx)

        }
    }

    async function run(cb: RunnerCallback<C, M>){
        const mounted = mount(cb)

        return mounted()
    }

    return {
        push,
        unshift,
        run,
        use,
        mount
    }
}