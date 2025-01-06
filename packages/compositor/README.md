# Compositor

Functions & utilities to create compositions functions, with typescript friendly interfaces

## Compose

This function gets a list of functions that have the same parameters and return a new function the output of all functions


### Simple usage

```ts
const addRole = (ctx: any) => ({
    role: ctx,name === 'Jonny' ? 'admin' : 'customer'
})

const addIsAdmin = (ctx: any) => ({
    isAdmin: () => ctx.name === 'Jonny'
})

const makeUser = (name: string) => compose([addRole, addIsAdmin])

const user = makeUser('Johnny')

user.name // string
user.role // string
user.isAdmin // () => boolean

```

### Promises
```ts
const addRole = async (ctx: any) => ({
    role: ctx,name === 'Jonny' ? 'admin' : 'customer'
})

const addIsAdmin = async (ctx: any) => ({
    isAdmin: () => ctx.name === 'Jonny'
})

const makeUser = (name: string) => compose.async([addRole, addIsAdmin])

const user = await makeUser('Johnny')

user.name // string
user.role // string

```
