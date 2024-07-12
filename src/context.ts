interface Context {
    [key: string]: any
}

export type Middleware = (context: Context) => Promise<Context>

export type ResolvedContext<M extends Middleware> = Awaited<ReturnType<M>>

type MergeTypes<T extends Middleware[]> = 
    T extends [infer First, ...infer Rest] ? 
        First extends Middleware ? 
            Rest extends Middleware[] ? 
                MergeTypes<Rest> & ResolvedContext<First> : 
                never : 
            never : 
        {}

export async function createContext<T extends Middleware[]>(...middlewares: T){
    let context: Context = {}

    for(const middleware of middlewares){
        const middlewareContext = await middleware(context)
        
        Object.assign(context, middlewareContext)
    }

    return context as MergeTypes<T>
}