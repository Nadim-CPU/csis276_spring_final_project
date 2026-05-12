import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteAccount,
    getAccounts,
    saveAccount,
} from '../../features/accounts/services/account.service';

export const fetchAccounts = createAsyncThunk(
    'accounts/fetchAll',
    async (userId) => getAccounts(userId),
);

export const createOrUpdateAccount = createAsyncThunk(
    'accounts/save',
    async ({ data, id }) => saveAccount(data, id),
);

export const removeAccount = createAsyncThunk(
    'accounts/remove',
    async (id) => {
        await deleteAccount(id);
        return id;
    },
);

const upsert = (items, saved) => {
    const i = items.findIndex((a) => a.account_id === saved.account_id);
    if (i >= 0) items[i] = { ...items[i], ...saved };
    else items.push(saved);
};

const accountsSlice = createSlice({
    name: 'accounts',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        clearAccountsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createOrUpdateAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrUpdateAccount.fulfilled, (state, action) => {
                upsert(state.items, action.payload);
                state.loading = false;
            })
            .addCase(createOrUpdateAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeAccount.fulfilled, (state, action) => {
                state.items = state.items.filter((account) => account.account_id !== Number(action.payload));
            });
    },
});

export const { clearAccountsError } = accountsSlice.actions;
export default accountsSlice.reducer;
