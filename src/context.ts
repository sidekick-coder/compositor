interface Context {
    [key: string]: any
}

export type Middleware = (context: Context) => Promise<Context>

export type MiddlewareResolvedContext<M extends Middleware> = Awaited<ReturnType<M>>

type UnionToIntersection<U> = 
  (U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never

export type MiddlewaresResults<T extends Middleware[]> = UnionToIntersection<MiddlewareResolvedContext<T[number]>>

interface Options<T extends Middleware[] = Middleware[]>{   
    middlewares: T
}

export async function createContext<M extends Middleware[]>(options: Options<M>){
    let context: Context = {}

    for await (const [key, middleware] of Object.entries(options.middlewares)){
        Object.assign(context, await middleware(context))
    }

    return context as MiddlewaresResults<M>
}