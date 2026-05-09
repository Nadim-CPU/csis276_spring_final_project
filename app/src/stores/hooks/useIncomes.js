import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createOrUpdateIncome,
    fetchIncomes,
    removeIncome,
} from '../slices/incomesSlice';

export const useIncomes = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.incomes.items);
    const loading = useSelector((state) => state.incomes.loading);
    const error = useSelector((state) => state.incomes.error);

    const loadIncomes = useCallback(
        (userId) => dispatch(fetchIncomes(userId)).unwrap(),
        [dispatch],
    );

    const saveIncome = useCallback(
        (data, id) => dispatch(createOrUpdateIncome({ data, id })).unwrap(),
        [dispatch],
    );

    const deleteIncome = useCallback(
        (id) => dispatch(removeIncome(id)).unwrap(),
        [dispatch],
    );

    return { items, loading, error, loadIncomes, saveIncome, deleteIncome };
};
