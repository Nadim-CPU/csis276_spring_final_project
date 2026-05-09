import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createOrUpdateExpense,
    fetchExpenses,
    removeExpense,
} from '../slices/expensesSlice';

export const useExpenses = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.expenses.items);
    const loading = useSelector((state) => state.expenses.loading);
    const error = useSelector((state) => state.expenses.error);

    const loadExpenses = useCallback(
        (userId) => dispatch(fetchExpenses(userId)).unwrap(),
        [dispatch],
    );

    const saveExpense = useCallback(
        (data, id) => dispatch(createOrUpdateExpense({ data, id })).unwrap(),
        [dispatch],
    );

    const deleteExpense = useCallback(
        (id) => dispatch(removeExpense(id)).unwrap(),
        [dispatch],
    );

    return { items, loading, error, loadExpenses, saveExpense, deleteExpense };
};
