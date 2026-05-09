import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = (key) => {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;
        try {
            return JSON.parse(stored);
        } catch {
            return stored;
        }
    } catch {
        return null;
    }
};

const initialState = {
    user: loadFromStorage('user'),
    accessToken: loadFromStorage('accessToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        signOut: (state) => {
            state.user = null;
            state.accessToken = null;
        },
    },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
