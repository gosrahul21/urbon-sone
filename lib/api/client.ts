import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://mora-unused-jada.ngrok-free.dev";

class ApiClient {
  private client: AxiosInstance;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const auth_token = await SecureStore.getItemAsync("auth_token");
          const token = JSON.parse(auth_token || "{}").accessToken;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors and retries
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized - Clear token and redirect to login
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          await SecureStore.deleteItemAsync("auth_token");
          await SecureStore.deleteItemAsync("user_data");

          // Emit event for auth state change (will be handled by context)
          // Note: In React Native, we'll use a different mechanism for events
          // The AuthContext will handle this through its own state management

          return Promise.reject(error);
        }

        // Retry logic for network errors
        if (
          !error.response &&
          this.retryCount < this.maxRetries &&
          originalRequest &&
          !originalRequest._retry
        ) {
          this.retryCount++;
          originalRequest._retry = true;

          // Exponential backoff
          const delay = Math.pow(2, this.retryCount) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));

          return this.client(originalRequest);
        }

        this.retryCount = 0;
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error
      return {
        message:
          error.response.data?.message || error.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: "Network error. Please check your connection.",
        status: 0,
      };
    } else {
      // Error setting up request
      return {
        message: error.message || "An unexpected error occurred",
        status: 0,
      };
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export const apiClient = new ApiClient();
