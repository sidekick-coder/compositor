interface Context {
    [key: string]: any
}

export type Middleware = (context: Context) => Promise<Context>

export type ResolvedContext<M extends Middleware> = Awaited<ReturnType<M>>

export type MiddlewaresResults<T extends Middleware[]> = 
    T extends [infer First, ...infer Rest] ? 
        First extends Middleware ? 
            Rest extends Middleware[] ? 
                MiddlewaresResults<Rest> & ResolvedContext<First> : 
                never : 
            never : 
        {}

export async function createContext<T extends Middleware[]>(...middlewares: T){
    let context: Context = {}

    for(const middleware of middlewares){
        const middlewareContext = await middleware(context)
        
        Object.assign(context, middlewareContext)
    }

    return context as MiddlewaresResults<T>
}