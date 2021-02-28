import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import Image from 'next/image';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/router';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
    const [logout, { loading: logoutFetching }] = useLogoutMutation();
    const apolloClient = useApolloClient();
    const { data, loading } = useMeQuery({
        skip: isServer(),
    });

    let body = null;

    // data is loading
    if (loading) {
        // user not logged in
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link mr={2}>register</Link>
                </NextLink>
            </>
        );
        // user is logged in
    } else {
        body = (
            <Flex align="center">
                {data?.me.isAdmin ? (
                    <NextLink href="/create-post">
                        <Button as={Link} mr={4}>
                            create post
                        </Button>
                    </NextLink>
                ) : null}
                <Box mr={2}>Welcome {data.me.username}</Box>
                <Button
                    onClick={async () => {
                        await logout();
                        await apolloClient.resetStore();
                        router.push('/');
                    }}
                    isLoading={logoutFetching}
                    variant="link"
                >
                    logout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex
            zIndex={1}
            position="sticky"
            top={0}
            bg="white"
            p={4}
            height="fit-content"
            color="white"
            backgroundColor="navy"
        >
            <Flex>
                <NextLink href="/">
                    <Link>
                        <Image
                            src="/logo.png"
                            alt="XFour logo"
                            height="100px"
                            width="400px"
                        />
                    </Link>
                </NextLink>
            </Flex>
            <Flex m="auto" flex={1} maxW={800} align="center">
                <Heading fontWeight="bold" fontFamily="body">
                    Career Hub
                </Heading>
                <Box ml="auto">{body}</Box>
            </Flex>
        </Flex>
    );
};
