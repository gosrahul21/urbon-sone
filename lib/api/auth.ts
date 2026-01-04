import { apiClient, ApiError } from "./client";
import * as SecureStore from "expo-secure-store";
import * as jwt from "jwt-decode";
export interface LoginCredentials {
  phoneNo: string;
}

export interface RegisterData {
  firstName: string,
  lastName: string,
  email: string;
  // password: string;
  phone?: string;
  dob: string;
  gender: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export const authApi = {
  async requestOTP(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/request-otp",
        credentials
      );
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/user-details",
        data
      );
      await SecureStore.setItemAsync("user_data", JSON.stringify(response));
      
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  decodeUserFromToken(token: string) {
    return jwt.jwtDecode(token);
  },

  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user_data");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  async getStoredToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync("auth_token");
    } catch (error) {
      return null;
    }
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  async verifyOTP(data: { phoneNo: string; otp: string }) {
    const response = await apiClient.post<AuthResponse>(
      "/auth/verify-otp",
      data
    );

    // Store token and user data
    await SecureStore.setItemAsync("auth_token", JSON.stringify(response));
    // await SecureStore.setItemAsync("user_data", JSON.stringify(response.user));
    return response;
  },

  async storeUser(data: any) {
    await SecureStore.setItemAsync("user_data", JSON.stringify(data));
  },

  async verifyToken(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>("/auth/me");
      // Update stored user data
      await SecureStore.setItemAsync(
        "user_data",
        JSON.stringify(response.user)
      );
      return response.user;
    } catch (error) {
      // Token invalid, clear storage
      await SecureStore.deleteItemAsync("auth_token");
      await SecureStore.deleteItemAsync("user_data");
      return null;
    }
  },
};
