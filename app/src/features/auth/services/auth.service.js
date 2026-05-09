import { requestGraphql } from '../../../services/api';

export const login = ({ user_email, password }) => {
    return requestGraphql(
        `mutation Login($input: LoginInput!) {
            login(input: $input) {
                authenticated
                access_token
                user {
                    user_id
                    user_first_name
                    user_last_name
                    user_email
                    user_dob
                }
            }
        }`,
        {
            variables: { input: { user_email, password } },
            includeMeta: true,
            dataPath: 'login',
        },
    );
};

export const register = ({ user_first_name, user_last_name, user_email, user_dob, password }) => {
    return requestGraphql(
        `mutation Register($input: RegisterInput!) {
            register(input: $input) {
                user_id
                user_first_name
                user_last_name
                user_email
                user_dob
            }
        }`,
        {
            variables: {
                input: { user_first_name, user_last_name, user_email, user_dob, password },
            },
            includeMeta: true,
            dataPath: 'register',
        },
    );
};
