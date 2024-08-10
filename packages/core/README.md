# Compositor

Functions & utilities to create compositions functions, with typescript friendly interfaces

## Compose

This function gets a list of functions that have the same parameters and return a new function the output of all functions


### Simple usage

```ts
const makeUser = (name: string) => {
    return {
        name,
    }
}

const addRole = (name: string) => ({
    role: name === 'Jonny' ? 'admin' : 'customer'
})

const addIsAdmin = (name: string) => ({
    isAdmin: () => name === 'Jonny'
})

const makeAll = compose(makeUser, [addRole, addIsAdmin])

const user = makeAll('Johnny')

user.name // string
user.role // string
user.isAdmin // () => boolean

```

### Promises
```ts
const makeUser = async (name: string) => {
    return Promise.resolve({
        name,
    })
}

const addRole = async (name: string) => ({
    role: name === 'Jonny' ? 'admin' : 'customer'
})


const makeAll = composeAsync(makeUser, [addRole]) // (name: string) => Promise

const user = await makeAll('Jonny')

user.name // string
user.role // string

```
