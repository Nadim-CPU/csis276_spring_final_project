import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createOrUpdateCategory,
    fetchCategories,
    removeCategory,
} from '../slices/categoriesSlice';

export const useCategories = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.categories.items);
    const loading = useSelector((state) => state.categories.loading);
    const error = useSelector((state) => state.categories.error);

    const loadCategories = useCallback(
        (userId) => dispatch(fetchCategories(userId)).unwrap(),
        [dispatch],
    );

    const saveCategory = useCallback(
        (data, id) => dispatch(createOrUpdateCategory({ data, id })).unwrap(),
        [dispatch],
    );

    const deleteCategory = useCallback(
        (id) => dispatch(removeCategory(id)).unwrap(),
        [dispatch],
    );

    return { items, loading, error, loadCategories, saveCategory, deleteCategory };
};