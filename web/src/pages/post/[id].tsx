import { Box, Heading, Text } from '@chakra-ui/react';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
    const { data, loading } = useGetPostFromUrl();

    if (loading) {
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
            <Text mb={4}>{data.post.text}</Text>
            <EditDeletePostButtons
                id={data.post.id}
                creatorId={data.post.creator.id}
            />
        </Layout>
    );
};

export default withApollo({ ssr: true })(Post);
