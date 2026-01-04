import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi, User } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { router } from "expo-router";

interface VerifyOtpPayload {
  phoneNo: string;
  otp: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // checkAuth();
    logout();
    // router.replace("/(auth)/register");
  }, []);
 
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = await authApi.getStoredToken();
      const storedUser = await authApi.getStoredUser();
      
      if (token && storedUser) {
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 1: Request OTP
  const requestOtp = async (phoneNo: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await authApi.requestOTP({ phoneNo });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to send OTP");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const verifyOtp = async ({ phoneNo, otp }: VerifyOtpPayload) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.verifyOTP({
        phoneNo,
        otp,
      });

      /**
       * Expected backend response:
       * {
       *   accessToken,
       *   refreshToken,
       *   isNewUser
       * }
       */

      // await authApi.storeTokens(response.accessToken, response.refreshToken);

      // decode token or call /me later
      const user: any = response.user;
      await authApi.storeUser(user);
      setUser(response.user!);
      if (response.user) router.replace("/(tabs)");
      else router.replace("/(auth)/register");

      return;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Invalid OTP");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        requestOtp,
        verifyOtp,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
