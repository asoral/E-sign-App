import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  full_name: string;
  email: string;
}

const initialState: UserState = {
  full_name: '',
  email: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ full_name: string; email: string }>) {
      state.full_name = action.payload.full_name;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.full_name = '';
      state.email = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
