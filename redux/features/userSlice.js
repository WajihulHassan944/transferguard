import { createSlice } from "@reduxjs/toolkit";

/* ==============================
   Initial State (MATCH BACKEND)
============================== */
const initialState = {
  /* ---------- Identity ---------- */
  id: null,
  firstName: null,
  lastName: null,
  email: null,
  profileUrl: null,
  

  /* ---------- Business ---------- */
  companyName: null,
  phone: null,
  address: null,
  postalCode: null,
  city: null,
  country: null,

  /* ---------- Account ---------- */
  plan:null,
  role: null,
  status: null,
  verified: false,
  newsletterOptIn: false,
  stripeAccountId: null,

  /* ---------- Security ---------- */
  twoFAEnabled: false,

  /* ---------- Meta ---------- */
  createdAt: null,
  lastLogin: [],
  workerStatus: null,
  workerUpdatedAt: null,

  /* ---------- App state ---------- */
  isLoggedIn: false,
  isAuthenticated: false,
  isHydrated: false,
};

/* ==============================
   Slice
============================== */
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    /* ---------- Login ---------- */
    loginUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
        isAuthenticated: true,
        isHydrated: true,
      };
    },

    /* ---------- Logout ---------- */
    logoutUser: () => {
      return {
        ...initialState,
        isHydrated: true,
      };
    },

    /* ---------- Profile update ---------- */
    updateProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    /* ---------- Small updates ---------- */
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
