import { Box, Heading, Text } from '@chakra-ui/react';
import { ApplyButton } from '../../components/ApplyButton';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { useMeQuery } from '../../generated/graphql';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';
import { withApollo } from '../../utils/withApollo';

const Post = ({}) => {
    const { data, loading } = useGetPostFromUrl();
    const { data: meData } = useMeQuery();

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

    const { id, title } = data.post;

    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading>
            <Text mb={4}>{data.post.text}</Text>
            {meData?.me ? (
                meData?.me?.isAdmin ? (
                    <EditDeletePostButtons
                        id={data.post.id}
                        creatorId={data.post.creator.id}
                    />
                ) : (
                    <ApplyButton
                        post={{ id, title }}
                        user={{ name: meData.me.name }}
                    />
                )
            ) : null}
        </Layout>
    );
};

export default withApollo({ ssr: true })(Post);
