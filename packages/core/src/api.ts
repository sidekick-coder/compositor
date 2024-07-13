import { Middleware } from "./context";
import { createRunner } from "./runner";


interface Route {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    handler: (args?: any) => any
}

interface Options<T extends Middleware[] = Middleware[]>{
    middlewares: T
    register: (route: Route) => void
}


export function createApi<M extends Middleware[]>(options: Options<M>){

    function register(route: Route){
        options.register(route)
    }

    function get(path: string) {
        const runner = createRunner({
            middlewares: options.middlewares
        })
        
        
        runner.run = async (cb) => {
            const handler = runner.mount(cb)
            
            register({ method: 'GET', handler, path })
        }

        return runner
    }
    
    return {
        options,
        register,
        get
    }
}