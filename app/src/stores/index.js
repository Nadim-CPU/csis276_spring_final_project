import { configureStore } from '@reduxjs/toolkit';
import accountsReducer from './slices/accountsSlice';
import authReducer from './slices/authSlice';
import categoriesReducer from './slices/categoriesSlice';
import expensesReducer from './slices/expensesSlice';
import incomesReducer from './slices/incomesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        accounts: accountsReducer,
        categories: categoriesReducer,
        expenses: expensesReducer,
        incomes: incomesReducer,
    },
});

store.subscribe(() => {
    const { user, accessToken } = store.getState().auth;
    try {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        } else {
            localStorage.removeItem('accessToken');
        }
    } catch {
        console.log('Error in (../stores/index.js)! <--');
    }
});
