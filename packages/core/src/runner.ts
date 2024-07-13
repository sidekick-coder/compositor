import { createContext, Middleware, MiddlewaresResults } from "./context";

interface Options<T extends Middleware[] = Middleware[]>{
    middlewares: T
}

export type Runner = ReturnType<typeof createRunner>

export function createRunner<M extends Middleware[] = Middleware[]>(options: Options<M>){
    const middlewares = options.middlewares.slice() as M

    function use<M2 extends Middleware>(middleware: M2){
        middlewares.push(middleware)

        return this as ReturnType<typeof createRunner<[...M, M2]>>
    }

    function mount(cb: (ctx: MiddlewaresResults<typeof middlewares>) => any){
        return async () => {
            const ctx = await createContext<typeof middlewares>({
                middlewares
            })
    
            return cb(ctx)

        }
    }

    async function run(cb: (ctx: MiddlewaresResults<typeof middlewares>) => any){
        const mounted = mount(cb)

        return mounted()
    }

    return {
        options,
        run,
        use,
        mount
    }
}