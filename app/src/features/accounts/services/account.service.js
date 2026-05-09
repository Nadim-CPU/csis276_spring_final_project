import { requestGraphql } from '../../../services/api';

export const getAccounts = (user_id) =>
    requestGraphql(
        `query Accounts($userId: Int!) {
            accounts(user_id: $userId) {
                account_id
                user_account_id
                account_name
                account_type
                account_balance
            }
        }`,
        { variables: { userId: user_id }, dataPath: 'accounts' },
    );

export const getAccount = (id) =>
    requestGraphql(
        `query Account($id: Int!) {
            account(id: $id) {
                account_id
                user_account_id
                account_name
                account_type
                account_balance
            }
        }`,
        { variables: { id }, dataPath: 'account' },
    );

export const saveAccount = async (data, id) => {
    if (id) {
        return requestGraphql(
            `mutation UpdateAccount($id: Int!, $input: UpdateAccountInput!) {
                updateAccount(id: $id, input: $input) {
                    account_id
                }
            }`,
            {
                variables: {
                    id,
                    input: {
                        account_name: data.account_name,
                        account_type: data.account_type,
                        account_balance: Number(data.account_balance),
                    },
                },
                dataPath: 'updateAccount',
            },
        );
    }
    return requestGraphql(
        `mutation CreateAccount($input: CreateAccountInput!) {
            createAccount(input: $input) {
                account_id
            }
        }`,
        {
            variables: {
                input: {
                    user_id: Number(data.user_id),
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
        { variables: { id }, dataPath: 'removeAccount' },
    );
