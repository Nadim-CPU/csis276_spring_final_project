import { requestGraphql } from '../../../services/api';

// Ensures DRY pattern

const CATEGORY_FIELDS = `
    category_id
    user_category_id
    category_name
    type
`
export const getCategories = () =>
    requestGraphql(
        `query Categories {
            categories {
                ${CATEGORY_FIELDS}
            }
        }`,
        {  dataPath: 'categories' },
    );

export const getCategory = (id) =>
    requestGraphql(
        `query Category($id: Int!) {
            category(id: $id) {
                ${CATEGORY_FIELDS}
            }
        }`,
        { variables: { id: Number(id) }, dataPath: 'category' },
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
        { variables: { id: Number(id) }, dataPath: 'removeCategory' },
    );
