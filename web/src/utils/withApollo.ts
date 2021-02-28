import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { withApollo as createWithApollo } from 'next-apollo';
import { PaginatedPosts } from '../generated/graphql';
import { isServer } from './isServer';

const client = (ctx: NextPageContext) =>
    new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include',
        headers: {
            cookie: (isServer() ? ctx?.req?.headers.cookie : undefined) || '',
        },
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            // this is needed to make the pagination work with the cache
                            keyArgs: [],
                            merge(
                                existing: PaginatedPosts | undefined,
                                incoming: PaginatedPosts
                            ): PaginatedPosts {
                                return {
                                    ...incoming,
                                    posts: [
                                        ...(existing?.posts || []),
                                        ...incoming.posts,
                                    ],
                                };
                            },
                        },
                    },
                },
            },
        }),
    });

export const withApollo = createWithApollo(client);
