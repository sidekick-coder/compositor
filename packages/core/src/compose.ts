import type { UnionToIntersection } from './common'

export interface Composable  {
	(...args: any): Record<string, any>
}

export interface ComposableExtend<T extends Composable> {
	(...args: Parameters<T>): Record<string, any>
}

export type ComposableResult<T extends Composable> = ReturnType<T>

export type ComposableResultList<T extends Composable[]> = UnionToIntersection<ComposableResult<T[number]>>

export function compose<Main extends Composable, Extras extends ComposableExtend<Main>>(main: Main, ...extras: Extras[]) {
	return (...args: Parameters<Main>) => {
		let result = main(...args)

		extras.forEach(fn => {
			result = Object.assign(result, fn(...args))
		});

		return result as ComposableResultList<[Main, Extras]>
	}
}
