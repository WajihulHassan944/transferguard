// utils/refreshUser.js
import { loginUser } from '@/redux/features/userSlice';
import { baseUrl } from '@/const';

export const refreshAndDispatchUser = async (dispatch) => {
  console.log("refresh called");
  try {
    const res = await fetch(`${baseUrl}/users/userdetails`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();

    if (res.ok && data.success) {
      const updatedUser = {
        ...data.user,
        wallet: data.wallet,
        videos: data.videos,
        cart: data.cart,
        invoices: data.invoices,
      };
      dispatch(loginUser(updatedUser));
      return true;
    } else {
      console.error('Failed to fetch updated user:', data.message || data.error);
      return false;
    }
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return false;
  }
};
