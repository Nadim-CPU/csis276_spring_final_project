import { requestGraphql } from '../../../services/api';

// Both Login and LoginWithFace can be DRY'd
const USER_FIELDS = `
    user_id
    user_first_name
    user_last_name
    user_email
    user_dob
`;

export const login = ({ user_email, password }) => {
    return requestGraphql(
        `mutation Login($input: LoginInput!) {
            login(input: $input) {
                authenticated
                access_token
                user {
                    ${USER_FIELDS}
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

export const loginWithFace = ({ user_email, descriptor }) => {
    return requestGraphql(
        `mutation LoginWithFace($input: LoginWithFaceInput!) {
            loginWithFace(input: $input) {
                authenticated
                access_token
                user {
                    ${USER_FIELDS}
                }
            }
        }`,
        {
            variables: { input: { user_email, descriptor } },
            includeMeta: true,
            dataPath: 'loginWithFace',
        },
    );
};

export const register = ({
    user_first_name,
    user_last_name,
    user_email,
    user_dob,
    password,
    face_descriptor,
}) => {
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
                input: {
                    user_first_name,
                    user_last_name,
                    user_email,
                    user_dob,
                    password,
                    face_descriptor,
                },
            },
            includeMeta: true,
            dataPath: 'register',
        },
    );
};
