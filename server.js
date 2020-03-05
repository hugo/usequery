const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const { v4 } = require('uuid');

const simpleSchema = gql`
    type Query {
        requestDetails: RequestDetails!
    }

    type RequestDetails {
        id: String!
    }
`;

const server = new ApolloServer({
    typeDefs: simpleSchema.loc.source.body,
    resolvers: {
        Query: {
            requestDetails: () => {
                // return { id: 'static' };
                return { id: v4() };
            },
        },
    },
});

const app = express();
server.applyMiddleware({ app, path: '/graphql' });

app.listen(4000, 'localhost', () => console.log(`🚀 Server ready at http://localhost:4000`));
