import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../auth/AuthService";
import { User } from "../../types/AuthTypes";

const initialState = {
  user: null as User | null,
  loading: false,
  error: null as string | null,
};

// Async Thunks
export const updateProfile = createAsyncThunk(
  "profile/update",
  async (data: Partial<User>, thunkAPI) => {
    try {
      return await AuthService.updateProfile(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (data: { currentPassword: string; newPassword: string }, thunkAPI) => {
    try {
      return await AuthService.updatePassword(data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
      })
      .addCase(updateProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export default profileSlice.reducer;
