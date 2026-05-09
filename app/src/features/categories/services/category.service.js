import { requestGraphql } from '../../../services/api';

export const getCategories = (user_id) =>
    requestGraphql(
        `query Categories($userId: Int!) {
            categories(user_id: $userId) {
                category_id
                user_category_id
                category_name
                type
            }
        }`,
        { variables: { userId: user_id }, dataPath: 'categories' },
    );

export const getCategory = (id) =>
    requestGraphql(
        `query Category($id: Int!) {
            category(id: $id) {
                category_id
                user_category_id
                category_name
                type
            }
        }`,
        { variables: { id }, dataPath: 'category' },
    );

export const saveCategory = async (data, id) => {
    if (id) {
        return requestGraphql(
            `mutation UpdateCategory($id: Int!, $input: UpdateCategoryInput!) {
                updateCategory(id: $id, input: $input) {
                    category_id
                }
            }`,
            {
                variables: {
                    id,
                    input: {
                        category_name: data.category_name,
                    },
                },
                dataPath: 'updateCategory',
            },
        );
    }
    return requestGraphql(
        `mutation CreateCategory($input: CreateCategoryInput!) {
            createCategory(input: $input) {
                category_id
            }
        }`,
        {
            variables: {
                input: {
                    user_id: Number(data.user_id),
                    category_name: data.category_name,
                    type: Boolean(data.type),
                },
            },
            dataPath: 'createCategory',
        },
    );
};

export const deleteCategory = (id) =>
    requestGraphql(
        `mutation RemoveCategory($id: Int!) {
            removeCategory(id: $id) { success }
        }`,
        { variables: { id }, dataPath: 'removeCategory' },
    );
