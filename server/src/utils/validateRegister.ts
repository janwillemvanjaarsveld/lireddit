import { UsernamePasswordInput } from 'src/resolvers/UsernamePasswordInput';

export const validateRegister = (options: UsernamePasswordInput) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: 'email',
                message: 'invalid email',
            },
        ];
    }
    // Only allow @xfour.co.za email addresses
    if (!options.email.endsWith('@xfour.co.za')) {
        return [
            {
                field: 'email',
                message:
                    'invalid email: only "@xfour.co.za" domain addresses are allowed',
            },
        ];
    }

    if (options.username.length <= 2) {
        return [
            {
                field: 'username',
                message: 'length must be greater than 2',
            },
        ];
    }

    if (options.username.includes('@')) {
        return [
            {
                field: 'username',
                message: 'cannot include an @',
            },
        ];
    }

    if (options.password.length <= 2) {
        return [
            {
                field: 'password',
                message: 'length must be greater than 2',
            },
        ];
    }
    return null;
};
