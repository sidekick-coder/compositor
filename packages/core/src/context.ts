export interface Context {
    [key: string]: any
}

export type Modifier<C = any> = (context: C) => Promise<any> | any

export type ModifierContext<M extends Modifier> = Awaited<ReturnType<M>>

type UnionToIntersection<U> = 
  (U extends any ? (x: U) => void : never) extends ((x: infer I)=> void) ? I : never

export type ModifierListContext<T extends Modifier[]> = UnionToIntersection<ModifierContext<T[number]>>

export interface ContextOptions<C extends Context = Context, M extends Modifier[] = Modifier[]>{   
    initial?: C
    modifiers: M
}

export async function createContext<C extends Context, M extends Modifier[]>(options: ContextOptions<C, M>){
    const context: any = {
        ...options.initial
    }

    for await (const modify of options.modifiers){
        Object.assign(context, await modify(context))
    }

    return context as C & ModifierListContext<M>
}
