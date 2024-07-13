export interface Context {
    [key: string]: any
}

export type Middleware = (context: Context) => Promise<Context>

export type MiddlewareResolvedContext<M extends Middleware> = Awaited<ReturnType<M>>

type UnionToIntersection<U> = 
  (U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never

export type MiddlewaresResults<T extends Middleware[]> = UnionToIntersection<MiddlewareResolvedContext<T[number]>>

export interface ContextOptions<C extends Context = Context, M extends Middleware[] = Middleware[]>{   
    baseContext?: C
    middlewares: M
}

export async function createContext<C extends Context, M extends Middleware[]>(options: ContextOptions<C, M>){
    const context: any = {
        ...options.baseContext
    }

    for await (const middleware of options.middlewares){
        Object.assign(context, await middleware(context))
    }

    return context as C & MiddlewaresResults<M>
}