import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteIncome,
    getIncomes,
    saveIncome,
} from '../../features/incomes/services/income.service';

export const fetchIncomes = createAsyncThunk(
    'incomes/fetchAll',
    async (userId) => getIncomes(userId),
);

export const createOrUpdateIncome = createAsyncThunk(
    'incomes/save',
    async ({ data, id }) => saveIncome(data, id),
);

export const removeIncome = createAsyncThunk(
    'incomes/remove',
    async (id) => {
        await deleteIncome(id);
        return id;
    },
);

const incomesSlice = createSlice({
    name: 'incomes',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        clearIncomesError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncomes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncomes.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchIncomes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeIncome.fulfilled, (state, action) => {
                state.items = state.items.filter((income) => income.income_id !== action.payload);
            });
    },
});

export const { clearIncomesError } = incomesSlice.actions;
export default incomesSlice.reducer;
