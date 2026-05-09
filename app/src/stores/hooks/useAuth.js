import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signIn as signInAction, signOut as signOutAction } from '../slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const accessToken = useSelector((state) => state.auth.accessToken);

    const signIn = useCallback(
        ({ user, accessToken }) => {
            dispatch(signInAction({ user, accessToken }));
        },
        [dispatch],
    );

    const signOut = useCallback(() => {
        dispatch(signOutAction());
    }, [dispatch]);

    return { user, accessToken, signIn, signOut };
};
