import {
    Box,
    Button,
    Flex,
    Heading,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { ApplyButton } from '../components/ApplyButton';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import { useMeQuery, usePostsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const Index = () => {
    const { data, error, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null,
        },
        notifyOnNetworkStatusChange: true,
    });
    const { data: meData } = useMeQuery();

    if (!loading && !data) {
        return (
            <div>
                <div>An error occured while loading the data</div>;
                <div>{error?.message}</div>
            </div>
        );
    }

    if (!meData?.me)
        return (
            <Layout>
                <Heading mt={100}>
                    Please login to few available positions
                </Heading>
            </Layout>
        );

    return (
        <Layout>
            {!data && loading ? (
                <div>loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) =>
                        !p ? null : (
                            <Flex
                                key={p.id}
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                            >
                                <Box flex={1}>
                                    <NextLink
                                        href="/position/[id]"
                                        as={`/position/${p.id}`}
                                    >
                                        <Link>
                                            <Heading fontSize="xl">
                                                {p.title}
                                            </Heading>
                                        </Link>
                                    </NextLink>
                                    <Flex align="center">
                                        <Text flex={1} mt={4}>
                                            {p.textSnippet}...
                                        </Text>
                                        <Box ml="auto">
                                            {/* Cannot apply for a job if you are not logged in */}
                                            {meData?.me ? (
                                                meData?.me?.isAdmin ? (
                                                    <EditDeletePostButtons
                                                        id={p.id}
                                                        creatorId={p.creator.id}
                                                    />
                                                ) : (
                                                    <ApplyButton
                                                        post={{
                                                            id: p.id,
                                                            title: p.title,
                                                        }}
                                                        user={{
                                                            name:
                                                                meData.me.name,
                                                        }}
                                                    />
                                                )
                                            ) : null}
                                        </Box>
                                    </Flex>
                                </Box>
                            </Flex>
                        )
                    )}
                </Stack>
            )}
            {data && data.posts.hasMore ? (
                <Flex>
                    <Button
                        onClick={() => {
                            fetchMore({
                                variables: {
                                    limit: variables?.limit,
                                    cursor:
                                        data.posts.posts[
                                            data.posts.posts.length - 1
                                        ].createdAt,
                                },
                            });
                        }}
                        isLoading={loading}
                        m="auto"
                        my={8}
                    >
                        load more
                    </Button>
                </Flex>
            ) : null}
        </Layout>
    );
};

export default withApollo({ ssr: true })(Index);
