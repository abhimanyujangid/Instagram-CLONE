import { ApiError, ApiClientInterface } from '../../services/apiClient';

// Types for requests and responses
export interface User {
  id: number;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  website: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

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
      return await this.apiClient.post<LoginResponse>('/auth/login', credentials);
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
      throw error;
    }
  }

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      return await this.apiClient.post<RegisterResponse>('/auth/register', data);
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 409:
            throw new Error('Email already exists');
          case 400:
            throw new Error('Invalid registration data');
          default:
            throw new Error(`Registration failed: ${error.message}`);
        }
      }
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      return await this.apiClient.put<User>('/user/profile', data);
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
      throw error;
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
      throw error;
    }
  }
}

// Create and export the auth service instance
import apiClient from "../../services/apiClient";
export const authService = new AuthService(apiClient);
export default authService;