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
                const motivation = prompt(
                    'Please add a short motivation of why you are the best candidate'
                );
                if (!motivation)
                    return alert(
                        'You cannot apply for a position without a motivation'
                    );
                await apply({ variables: { post, user, motivation } });
                alert('Succesfully applied for the position');
            }}
        >
            Apply
        </Button>
    );
};
