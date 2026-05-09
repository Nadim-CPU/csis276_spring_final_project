import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createOrUpdateAccount,
    fetchAccounts,
    removeAccount,
} from '../slices/accountsSlice';

export const useAccounts = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.accounts.items);
    const loading = useSelector((state) => state.accounts.loading);
    const error = useSelector((state) => state.accounts.error);

    const loadAccounts = useCallback(
        (userId) => dispatch(fetchAccounts(userId)).unwrap(),
        [dispatch],
    );

    const saveAccount = useCallback(
        (data, id) => dispatch(createOrUpdateAccount({ data, id })).unwrap(),
        [dispatch],
    );

    const deleteAccount = useCallback(
        (id) => dispatch(removeAccount(id)).unwrap(),
        [dispatch],
    );

    return { items, loading, error, loadAccounts, saveAccount, deleteAccount };
};
