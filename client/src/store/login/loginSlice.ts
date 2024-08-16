import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  data: any | null;
  status: boolean;
}

const initialState: UserState = {
  data: null,
  status: false,
};

const loginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.data = action.payload.data;
    },
    logout: (state) => {
      state.status = false;
      state.data = null;
    },
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
