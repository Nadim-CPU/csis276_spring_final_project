import { requestGraphql } from '../../../services/api';

// Both getters can be DRY'd
const ACCOUNT_FIELDS = `
    account_id
    user_account_id
    account_name
    account_type
    account_balance
`;

export const getAccounts = () =>
    requestGraphql(
        `query Accounts {
            accounts {
                ${ACCOUNT_FIELDS}
            }
        }`,
        { dataPath: 'accounts' },
    );

export const getAccount = (id) =>
    requestGraphql(
        `query Account($id: Int!) {
            account(id: $id) {
                ${ACCOUNT_FIELDS}
            }
        }`,
        { variables: { id: Number(id) }, dataPath: 'account' },
    );

export const saveAccount = async (data, id) => {
    if (id) {
        return requestGraphql(
            `mutation UpdateAccount($id: Int!, $input: UpdateAccountInput!) {
                updateAccount(id: $id, input: $input) {
                    ${ACCOUNT_FIELDS}
                }
            }`,
            {
                variables: {
                    id: Number(id),
                    input: {
                        account_name: data.account_name,
                        account_type: data.account_type,
                    },
                },
                dataPath: 'updateAccount',
            },
        );
    }
    return requestGraphql(
        `mutation CreateAccount($input: CreateAccountInput!) {
            createAccount(input: $input) {
                ${ACCOUNT_FIELDS}
            }
        }`,
        {
            variables: {
                input: {
                    account_name: data.account_name,
                    account_type: data.account_type,
                    account_balance: Number(data.account_balance),
                },
            },
            dataPath: 'createAccount',
        },
    );
};

export const deleteAccount = (id) =>
    requestGraphql(
        `mutation RemoveAccount($id: Int!) {
            removeAccount(id: $id) { success }
        }`,
        { variables: { id: Number(id) }, dataPath: 'removeAccount' },
    );
