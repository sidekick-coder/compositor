import { createContext } from './context';
import type { Context, Modifier, ModifierContext, ModifierListContext } from './context';


export interface RunnerCallback<C extends Context>{
    (ctx: C): any
}

export interface Runner<C extends Context = Context> {
    context: C
    modifiers: Modifier[]
    push<M2 extends Modifier>(middleware: M2): Runner<C & ModifierContext<M2>>
    pushAll<M2 extends Modifier[]>(modifiers: M2): Runner<C & ModifierListContext<M2>>
    unshift<M2 extends Modifier>(middleware: M2): Runner<C & ModifierContext<M2>>
    run(cb: RunnerCallback<C>): Promise<any>
    use<M2 extends Modifier>(middleware: M2): Runner<C & ModifierContext<M2>>
    mount(cb: RunnerCallback<C>): () => Promise<any>
    clone(): Runner<C>

    // ts only
    infer<C2 extends Context, M extends Modifier[]>(): Runner<C2 & ModifierListContext<M>>
}

export function createRunner<C extends Context>(initial?: C): Runner<C> {
    const modifiers = [] as Modifier[]

    function push<M2 extends Modifier>(middleware: M2){
        modifiers.push(middleware)

        return this
    }

    function pushAll<M2 extends Modifier[]>(newModifiers: M2){
        modifiers.push(...newModifiers)

        return this
    }

    function unshift<M2 extends Modifier>(middleware: M2){
        modifiers.unshift(middleware)

        return this
    }

    function use<M2 extends Modifier>(middleware: M2){
        modifiers.push(middleware)

        return this
    }

    function mount(cb: RunnerCallback<C>){
        return async () => {
            const ctx = await createContext({
                initial,
                modifiers
            })
    
            return cb(ctx)

        }
    }

    async function run(cb: RunnerCallback<C>){
        const mounted = mount(cb)

        return mounted()
    }

    function clone(){
        return createRunner(initial)
            .pushAll(modifiers)
    }

    function infer<C2 extends Context, M extends Modifier>(){
        return this as Runner<C2 & ModifierContext<M>>
    }

    return {
        context: initial as C,
        modifiers,
        push,
        pushAll,
        unshift,
        run,
        use,
        mount,
        clone,

        // ts only
        infer,
    }
}
