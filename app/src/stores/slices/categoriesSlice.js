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
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.items = state.items.filter((category) => category.category_id !== action.payload);
            });
    },
});

export const { clearCategoriesError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
