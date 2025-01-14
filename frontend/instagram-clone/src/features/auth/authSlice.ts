import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './AuthService';
import { LoginCredentials, RegisterData, AuthState,User } from '../../types/AuthTypes';
import { useDispatch } from 'react-redux';

// Define the initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Define async thunks for login and register and get logged in user , logout
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response.user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getLoggedInUser = createAsyncThunk(
  "home",
  async (_, { rejectWithValue }) => {
    try {
      const user: User = await authService.getLoggedInUser();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred while fetching the logged-in user");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred while logging out");
    }
  }
)

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(getLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoggedInUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = payload;
      })
      .addCase(getLoggedInUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});


export default authSlice.reducer;