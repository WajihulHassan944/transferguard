import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: null,
  lastName: null,
  profileUrl: null,
  email: null,
  country: null,
  role: [],
  verified: false,
  createdAt: null,
  isLoggedIn: false,
  isAuthenticated: false,
  isHydrated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
        isAuthenticated: true,
        isHydrated: true,
      };
    },
    logoutUser: () => {
      return {
        ...initialState,
        isHydrated: true,
      };
    },
    updateProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
        isHydrated: true,
      };
    },
    setVerified: (state, action) => {
      state.verified = action.payload;
    },
    setAuthentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setHydrated: (state, action) => {
      state.isHydrated = action.payload;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  updateProfile,
  setVerified,
  setAuthentication,
  setHydrated,
} = userSlice.actions;

export default userSlice.reducer;
