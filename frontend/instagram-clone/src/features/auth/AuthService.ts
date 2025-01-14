import { ApiError, ApiClientInterface } from '../../services/apiClient';
import {
  User,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  UpdatePasswordData
} from '../../types/AuthTypes';

export interface AuthServiceInterface {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  register(data: RegisterData): Promise<RegisterResponse>;
  updateProfile(data: Partial<User>): Promise<User>;
  updatePassword(data: UpdatePasswordData): Promise<void>;
}

export class AuthService implements AuthServiceInterface {
  constructor(private apiClient: ApiClientInterface) {}

  // login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponse>('/users/login', credentials);
      if (response) {
        localStorage.setItem('accessToken', response?.data?.accessToken);
      }
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            throw new Error('Invalid credentials');
          case 404:
            throw new Error('User not found');
          default:
            throw new Error(`Login failed: ${error.message}`);
        }
      }
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during login');
    }
  }

  // register
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await this.apiClient.post<RegisterResponse>('/users/register', data);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 409:
            throw new Error('Email already exists');
          case 400:
            throw new Error('User already exists');
          default:
            throw new Error(`Registration failed: ${error.message}`);
        }
      }
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during registration');
    }
  }

// get logged in user
  async getLoggedInUser(): Promise<User> {
    try {
      const response = await this.apiClient.get<User>('/users/current-user');
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            throw new Error('Unauthorized: Please log in to access this resource.');
          case 404:
            throw new Error('User not found.');
          default:
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching the logged-in user');
    }
  }
// logout
async logout(): Promise<void> {
  try {
    const response = await this.apiClient.post<void>('/users/logout');
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          throw new Error('Unauthorized: Please log in to access this resource.');
        default:
          throw new Error(`Logout failed: ${error.message}`);
      }
    }
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during logout');
  }
}

  // update profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.apiClient.put<User>('/user/profile', data);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            throw new Error('Unauthorized');
          case 400:
            throw new Error('Invalid profile data');
          default:
            throw new Error(`Profile update failed: ${error.message}`);
        }
      }
      if (error instanceof Error) {
        throw new Error(`Profile update failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during profile update');
    }
  }



  async updatePassword(data: UpdatePasswordData): Promise<void> {
    try {
      await this.apiClient.put<void>('/user/password', data);
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            throw new Error('Current password is incorrect');
          case 400:
            throw new Error('Invalid password format');
          default:
            throw new Error(`Password update failed: ${error.message}`);
        }
      }
      if (error instanceof Error) {
        throw new Error(`Password update failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during password update');
    }
  }
}

// Create and export the auth service instance
import apiClient from "../../services/apiClient";
export const authService = new AuthService(apiClient);