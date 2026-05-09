import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteExpense,
    getExpenses,
    saveExpense,
} from '../../features/expenses/services/expense.service';

export const fetchExpenses = createAsyncThunk(
    'expenses/fetchAll',
    async (userId) => getExpenses(userId),
);

export const createOrUpdateExpense = createAsyncThunk(
    'expenses/save',
    async ({ data, id }) => saveExpense(data, id),
);

export const removeExpense = createAsyncThunk(
    'expenses/remove',
    async (id) => {
        await deleteExpense(id);
        return id;
    },
);

const expensesSlice = createSlice({
    name: 'expenses',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        clearExpensesError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeExpense.fulfilled, (state, action) => {
                state.items = state.items.filter((expense) => expense.expense_id !== action.payload);
            });
    },
});

export const { clearExpensesError } = expensesSlice.actions;
export default expensesSlice.reducer;
