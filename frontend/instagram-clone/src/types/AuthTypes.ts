//=====================Type definitions for auth features======================

// Authservice Types  
export interface LoginCredentials {
  email: string;
  password: string;
  username: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}


// AuthSlice Types

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}


// ProfileSlice Types
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


//
