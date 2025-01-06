import type { UnionToIntersection } from './common'

export interface Composable {
	(...args: any): Record<string, any> | Promise<Record<string, any>>
}

export interface ComposableExtend<T extends Composable> {
	(...args: Parameters<T>): Record<string, any> | Promise<Record<string, any>>
}

export type ComposableResult<T extends Composable> = Awaited<ReturnType<T>>

export type ComposableResultList<T extends Composable[]> = UnionToIntersection<ComposableResult<T[number]>>

export function compose<T extends Composable>(composables: T[]) {
		let result = {}

		for (const fn of composables) {
			result = Object.assign(result, fn(result))
		}

		return result as ComposableResultList<[T]>
}

compose.async = async function<T extends Composable>(composables: T[]) {
		let result = {}

		for await (const fn of composables) {
			result = Object.assign(result, await fn(result))
		}

		return result as ComposableResultList<[T]>
}

