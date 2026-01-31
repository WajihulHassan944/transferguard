import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Identity
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  profileUrl: null,

  // Account
  role: null,
  status: null,
  verified: false,
  twoFAEnabled: false,

  // Meta
  country: null,
  createdAt: null,
  lastLogin: [],

  // App state
  isLoggedIn: false,
  isAuthenticated: false,
  isHydrated: false,
};

const userSlice = createSlice({
  name: "user",
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

    setTwoFAEnabled: (state, action) => {
      state.twoFAEnabled = action.payload;
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
  setTwoFAEnabled,
  setAuthentication,
  setHydrated,
} = userSlice.actions;

export default userSlice.reducer;
