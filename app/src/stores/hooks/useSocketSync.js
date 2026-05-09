import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getSocket, SOCKET_ENABLED } from '../../services/socket';
import { useAuth } from './useAuth';
import { fetchAccounts } from '../slices/accountsSlice';
import { fetchCategories } from '../slices/categoriesSlice';
import { fetchExpenses } from '../slices/expensesSlice';
import { fetchIncomes } from '../slices/incomesSlice';

export const useSocketSync = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();

    useEffect(() => {
        if (!SOCKET_ENABLED || !user) return undefined;

        const socket = getSocket();
        if (!socket) return undefined;

        const isMine = (payload) => payload?.user_id === user.user_id;

        const onAccount = (payload) => {
            if (isMine(payload)) dispatch(fetchAccounts(user.user_id));
        };
        const onCategory = (payload) => {
            if (isMine(payload)) dispatch(fetchCategories(user.user_id));
        };
        const onExpense = (payload) => {
            if (isMine(payload)) dispatch(fetchExpenses(user.user_id));
        };
        const onIncome = (payload) => {
            if (isMine(payload)) dispatch(fetchIncomes(user.user_id));
        };

        socket.on('account.changed', onAccount);
        socket.on('category.changed', onCategory);
        socket.on('expense.changed', onExpense);
        socket.on('income.changed', onIncome);
        socket.connect();

        return () => {
            socket.off('account.changed', onAccount);
            socket.off('category.changed', onCategory);
            socket.off('expense.changed', onExpense);
            socket.off('income.changed', onIncome);
            socket.disconnect();
        };
    }, [user, dispatch]);
};
