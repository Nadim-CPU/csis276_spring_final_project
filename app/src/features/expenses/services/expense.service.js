import { requestGraphql } from '../../../services/api';


// Ensures DRY pattern
const EXPENSE_FIELDS = `
    expense_id
    user_expense_id
    expense_amount
    expense_source
    expense_date
    category_expense_id
    account_expense_id
    category { category_id category_name }
    account { account_id account_name }
`;

export const getExpenses = (user_id) =>
    requestGraphql(
        `query Expenses($userId: Int!) {
            expenses(user_id: $userId) { ${EXPENSE_FIELDS} }
        }`,
        { variables: { userId: user_id }, dataPath: 'expenses' },
    );

export const getExpense = (id) =>
    requestGraphql(
        `query Expense($id: Int!) {
            expense(id: $id) { ${EXPENSE_FIELDS} }
        }`,
        { variables: { id }, dataPath: 'expense' },
    );

export const saveExpense = async (data, id) => {
    if (id) {
        return requestGraphql(
            `mutation UpdateExpense($id: Int!, $input: UpdateExpenseInput!) {
                updateExpense(id: $id, input: $input) { expense_id }
            }`,
            {
                variables: {
                    id,
                    input: {
                        expense_amount: Number(data.expense_amount),
                        expense_source: data.expense_source,
                        expense_date: data.expense_date,
                        category_expense_id: Number(data.category_expense_id),
                        account_expense_id: Number(data.account_expense_id),
                    },
                },
                dataPath: 'updateExpense',
            },
        );
    }
    return requestGraphql(
        `mutation CreateExpense($input: CreateExpenseInput!) {
            createExpense(input: $input) { expense_id }
        }`,
        {
            variables: {
                input: {
                    user_id: Number(data.user_id),
                    expense_amount: Number(data.expense_amount),
                    expense_source: data.expense_source,
                    expense_date: data.expense_date,
                    category_expense_id: Number(data.category_expense_id),
                    account_expense_id: Number(data.account_expense_id),
                },
            },
            dataPath: 'createExpense',
        },
    );
};

export const deleteExpense = (id) =>
    requestGraphql(
        `mutation RemoveExpense($id: Int!) {
            removeExpense(id: $id) { success }
        }`,
        { variables: { id }, dataPath: 'removeExpense' },
    );
