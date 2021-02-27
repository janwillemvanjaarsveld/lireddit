import { Box, Button, useProps } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import {
    useForgotPasswordMutation,
    useLogoutMutation,
} from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [email, setEmail] = useState('');
    const [forgotPassword] = useForgotPasswordMutation();
    const [logout] = useLogoutMutation();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ email: '' }}
                onSubmit={async (values) => {
                    await forgotPassword({ variables: values });
                    await logout();
                    setComplete(true);
                    setEmail(values.email);
                }}
            >
                {({ isSubmitting }) =>
                    complete ? (
                        <Box>An email has been sent to the email: {email}</Box>
                    ) : (
                        <Form>
                            <InputField
                                name="email"
                                placeholder="email"
                                label="Email"
                            />
                            <Button
                                mt={4}
                                type="submit"
                                isLoading={isSubmitting}
                                color="teal"
                            >
                                Forgot password
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </Wrapper>
    );
};

export default withApollo({ ssr: false })(ForgotPassword);
