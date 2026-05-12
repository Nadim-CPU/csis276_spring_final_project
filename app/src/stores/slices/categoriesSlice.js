import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteCategory,
    getCategories,
    saveCategory,
} from '../../features/categories/services/category.service';

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (userId) => getCategories(userId),
);

export const createOrUpdateCategory = createAsyncThunk(
    'categories/save',
    async ({ data, id }) => saveCategory(data, id),
);

export const removeCategory = createAsyncThunk(
    'categories/remove',
    async (id) => {
        await deleteCategory(id);
        return id;
    },
);

const upsert = (items, saved) => {
    const i = items.findIndex((c) => c.category_id === saved.category_id);
    if (i >= 0) items[i] = { ...items[i], ...saved };
    else items.push(saved);
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        clearCategoriesError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createOrUpdateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrUpdateCategory.fulfilled, (state, action) => {
                upsert(state.items, action.payload);
                state.loading = false;
            })
            .addCase(createOrUpdateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.items = state.items.filter((category) => category.category_id !== Number(action.payload));
            });
    },
});

export const { clearCategoriesError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
