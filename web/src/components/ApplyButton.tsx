import { Button } from '@chakra-ui/react';
import React from 'react';
import {
    ApplyPostInput,
    useApplyMutation,
    UserApplyPostInput,
} from '../generated/graphql';

interface ApplyButtonProps {
    post: ApplyPostInput;
    user: UserApplyPostInput;
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({ post, user }) => {
    const [apply] = useApplyMutation();
    return (
        <Button
            colorScheme="green"
            onClick={async () => {
                await apply({ variables: { post, user } });
                alert('Succesfully applied for the position');
            }}
        >
            Apply
        </Button>
    );
};
