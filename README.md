
## Description

This is a simple Create React App demonstrating a bug with Apollo's "useQuery" with the new version of React 16.3.0.

## Duplicating

```sh
npm install
npm run start
```

Then, open the developer tools window and you'll **sometimes** see the warning:

```
index.js:1 Warning: Cannot update a component from inside the function body of a different component.
    in InnerComponent (at src/index.tsx:41)
    in WrapperComponent (at src/index.tsx:52)
    in ApolloProvider (at src/index.tsx:46)
```

Increasing the number of `WrapperComponent` will also increase the chance of the warning:
 - 1 component will NEVER throw a warning
 - 2 component will SOMETIMES throw a warning 
 - 3 component will ALWAYS throw 1 to 3 warnings 

There are a number of ways to make this error disappear:

1. Remove the `if (loading)` check on line 37 in src/index.tsx.
2. The unique values of the `WrapperComponent` are set to the same value
3. Change `requestDetails` node to return the same value (server side)
4. Setting `fetchPolicy: 'network-only'` in the `InnerComponent`'s query

From this I would infer that updates caused by cache changes are the cause of the warning.
