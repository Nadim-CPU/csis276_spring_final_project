import { requestGraphql } from '../../../services/api';

// Ensures DRY pattern
const INCOME_FIELDS = `
    income_id
    user_income_id
    income_amount
    income_source
    income_date
    category_income_id
    account_income_id
    category { category_id category_name }
    account { account_id account_name }
`;

export const getIncomes = (user_id) =>
    requestGraphql(
        `query Incomes($userId: Int!) {
            incomes(user_id: $userId) { ${INCOME_FIELDS} }
        }`,
        { variables: { userId: user_id }, dataPath: 'incomes' },
    );

export const getIncome = (id) =>
    requestGraphql(
        `query Income($id: Int!) {
            income(id: $id) { ${INCOME_FIELDS} }
        }`,
        { variables: { id }, dataPath: 'income' },
    );

export const saveIncome = async (data, id) => {
    if (id) {
        return requestGraphql(
            `mutation UpdateIncome($id: Int!, $input: UpdateIncomeInput!) {
                updateIncome(id: $id, input: $input) { income_id }
            }`,
            {
                variables: {
                    id,
                    input: {
                        income_amount: Number(data.income_amount),
                        income_source: data.income_source,
                        income_date: data.income_date,
                        category_income_id: Number(data.category_income_id),
                        account_income_id: Number(data.account_income_id),
                    },
                },
                dataPath: 'updateIncome',
            },
        );
    }
    return requestGraphql(
        `mutation CreateIncome($input: CreateIncomeInput!) {
            createIncome(input: $input) { income_id }
        }`,
        {
            variables: {
                input: {
                    user_id: Number(data.user_id),
                    income_amount: Number(data.income_amount),
                    income_source: data.income_source,
                    income_date: data.income_date,
                    category_income_id: Number(data.category_income_id),
                    account_income_id: Number(data.account_income_id),
                },
            },
            dataPath: 'createIncome',
        },
    );
};

export const deleteIncome = (id) =>
    requestGraphql(
        `mutation RemoveIncome($id: Int!) {
            removeIncome(id: $id) { success }
        }`,
        { variables: { id }, dataPath: 'removeIncome' },
    );
