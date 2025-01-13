import { Context, Modifier, ModifierContext, ModifierListContext } from './context'
import { compose } from './compose'

interface ChainMount<C extends Context> {
    (): C
    async():  Promise<C>
}

export interface Chain<C extends Context> {
    modifiers: Modifier[]
    use<M2 extends Modifier>(middleware: M2): Chain<C & ModifierContext<M2>>
    mount: ChainMount<C>
    infer<C2 extends Context, M extends Modifier[]>(): Chain<C2 & ModifierListContext<M>>
}

export type ChainExtendMethods<T extends Chain<Context>> = Omit<T, 'modifiers' | 'use' | 'mount' | 'infer'>

export function createChain<C extends Context, T extends Chain<C>>(extend: ChainExtendMethods<T>): T {
    const modifiers = [] as Modifier[]

    function use<M2 extends Modifier>(middleware: M2){
        modifiers.push(middleware)

        return this
    }

    function mount(){
        return compose(modifiers)
    }

    mount.async = () => compose.async(modifiers)

    function infer<C2 extends Context, M extends Modifier[]>(){
        return this as unknown as Chain<C2 & ModifierListContext<M>>
    }

    return {
        ...extend,
        modifiers,
        use,
        mount,
        infer
    } as T

}
