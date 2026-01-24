'use client';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/features/userSlice';
import { baseUrl } from '@/const';

import { Toaster, toast } from 'react-hot-toast';
const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async (callback) => {
    try {
      const res = await fetch(`${baseUrl}/users/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('Logout successful!');
        dispatch(logoutUser());
        if (typeof callback === 'function') callback();
        router.push('/');
      } else {
        toast.error('Logout failed!');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('An error occurred while logging out.');
    }
  };

  return handleLogout;
};

export default useLogout;
