import { createContext, Middleware, MiddlewaresResults } from "./context";

interface Options<T extends Middleware[] = Middleware[]>{
    middlewares: T
}

export function createRunner<M extends Middleware[]>(...middlewares: M){

    function use<T2 extends Middleware>(middleware: T2){
        middlewares.push(middleware)

        return this
    }

    function mount(cb: (ctx: MiddlewaresResults<M>) => any){
        return async () => {
            const ctx = await createContext(...middlewares)
    
            return cb(ctx)

        }
    }

    async function run(cb: (ctx: MiddlewaresResults<M>) => any){
        const mounted = mount(cb)

        return mounted()
    }

    return {
        middlewares,

        run,
        use,
        mount
    }
}