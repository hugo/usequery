import { ApolloProvider as ApolloHooksProvider, useQuery } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import React from 'react';
import ReactDOM from 'react-dom';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: '/graphql',
    }),
});

const MY_QUERY = gql(`
query MyQuery {
  requestDetails {
      id
  }
}
`);

function InnerComponent(props: { someUniqueValue: number }) {
    const { data } = useQuery(MY_QUERY, {
        variables: { key: props.someUniqueValue },
        // fetchPolicy: 'network-only',
    });
    console.log(`[InnerComponent ${ props.someUniqueValue }]`, data && data.requestDetails.id);
    return <p>{ JSON.stringify(data) }</p>;
}

function WrapperComponent(props: { someUniqueValue: number }) {
    const { loading } = useQuery(MY_QUERY, {
        variables: { key: props.someUniqueValue },
    });
    // Removing this check will make the React warnings go away.
    if (loading) {
        return <p>loading</p>;
    }
    return <>
        <InnerComponent someUniqueValue={ props.someUniqueValue }/>
    </>;
}

ReactDOM.render(
    <ApolloHooksProvider client={ client }>
        {/*There is no error with one children. The more you add, the higher the chance*/ }
        {/*1 component: no warning*/ }
        {/*2 components: sometimes it gives a warning*/ }
        {/*3 components: random 1 to 3 warnings*/ }
        <WrapperComponent someUniqueValue={ 1 }/>
        <WrapperComponent someUniqueValue={ 2 }/>
        <WrapperComponent someUniqueValue={ 3 }/>
    </ApolloHooksProvider>,
    document.getElementById('root'),
);
