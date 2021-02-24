import { Box, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

const Post = ({}) => {
    const [{ data, fetching }] = useGetPostFromUrl();

    if (fetching) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        );
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>Post does not exist</Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading>
            <Box mb={4}>{data.post.text}</Box>
            <EditDeletePostButtons
                id={data.post.id}
                creatorId={data.post.creator.id}
            />
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
