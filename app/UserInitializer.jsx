'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  setHydrated,
} from '@/redux/features/userSlice';
import { baseUrl } from '@/const';

const UserInitializer = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
 dispatch(setHydrated(true));
    const fetchUser = async () => {

      if (!isLoggedIn) {
        try {
          const res = await fetch(`${baseUrl}/users/userdetails`, {
            method: 'GET',
            credentials: 'include',
          });
          const data = await res.json();

          if (res.ok && data.success) {
            const userWithData = {
              ...data.user
            };
            dispatch(loginUser(userWithData));
          }
        } catch (err) {
          console.error('User session check failed:', err);
        }
      }
    };

    fetchUser();
  }, [dispatch, isLoggedIn]);

  return null;
};

export default UserInitializer;
