import type { UnionToIntersection } from './common'

export interface ComposableRecord {
    [key: string]: any
}

export interface ComposableFunciton {
	(...args: any): Record<string, any>
}

export interface ComposableAsyncFunction {
    (...args: any): Promise<Record<string, any>>
}

export type Composable = ComposableFunciton | ComposableAsyncFunction | ComposableRecord

export type ComposableResult<T extends Composable> = 
    T extends ComposableAsyncFunction ? Awaited<ReturnType<T>> :
    T extends ComposableFunciton ? ReturnType<T> :
    T

export type ComposableResultList<T extends Composable[]> = UnionToIntersection<ComposableResult<T[number]>>

export function compose<T extends Composable>(composables: T[]) {
		let result = {}

		for (const fn of composables) {

            if (typeof fn === 'function') {
                result = Object.assign(result, fn(result))
            }

            if (typeof fn === 'object') {
                result = Object.assign(result, fn)
            }
		}

		return result as ComposableResultList<[T]>
}

compose.async = async function<T extends Composable>(composables: T[]) {
		let result = {}

		for await (const fn of composables) {
            if (typeof fn === 'function') {
                result = Object.assign(result, await fn(result))
            }

            if (typeof fn === 'object') {
                result = Object.assign(result, fn)
            }
		}

		return result as ComposableResultList<[T]>
}

