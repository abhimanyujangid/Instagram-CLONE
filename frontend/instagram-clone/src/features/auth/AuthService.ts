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

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponse>('/users/login', credentials);
      if ('token' in response) {
        // localStorage.setItem('accessToken', response.token);
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