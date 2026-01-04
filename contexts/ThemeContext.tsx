import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark" | "auto";

interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    card: string;
    // Premium accent colors for menus and UI elements
    accent: {
      blue: string;
      green: string;
      orange: string;
      purple: string;
      pink: string;
      cyan: string;
      yellow: string;
    };
    // Status colors for bookings and states
    status: {
      confirmed: string;
      scheduled: string;
      completed: string;
      cancelled: string;
      pending: string;
    };
    // Interactive states
    interactive: {
      hover: string;
      pressed: string;
      disabled: string;
    };
  };
}

const lightTheme: Theme["colors"] = {
  primary: "#00D9A5",
  secondary: "#FF6B35",
  background: "#F9FAFB",
  surface: "#FFFFFF",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  card: "#FFFFFF",
  // Premium accent colors
  accent: {
    blue: "#3B82F6",
    green: "#10B981",
    orange: "#F59E0B",
    purple: "#8B5CF6",
    pink: "#EC4899",
    cyan: "#06B6D4",
    yellow: "#FBBF24",
  },
  // Status colors
  status: {
    confirmed: "#10B981",
    scheduled: "#3B82F6",
    completed: "#6B7280",
    cancelled: "#EF4444",
    pending: "#F59E0B",
  },
  // Interactive states
  interactive: {
    hover: "#F3F4F6",
    pressed: "#E5E7EB",
    disabled: "#D1D5DB",
  },
}; 

const darkTheme: Theme["colors"] = {
  primary: "#5EEAD4",        // Mint
  secondary: "#E5E7EB",
  background: "#020617",
  surface: "rgba(255,255,255,0.04)",
  card: "rgba(255,255,255,0.06)",
  text: "#F8FAFC",
  textSecondary: "#CBD5E1", 
  border: "rgba(255,255,255,0.08)",
  error: "#FB7185",
  success: "#34D399",
  warning: "#FACC15",
  // Premium accent colors (slightly adjusted for dark mode)
  accent: {
    blue: "#60A5FA",
    green: "#34D399",
    orange: "#FBBF24",
    purple: "#A78BFA",
    pink: "#F472B6",
    cyan: "#22D3EE",
    yellow: "#FCD34D",
  },
  // Status colors
  status: {
    confirmed: "#34D399",
    scheduled: "#60A5FA",
    completed: "#9CA3AF",
    cancelled: "#F87171",
    pending: "#FBBF24",
  },
  // Interactive states
  interactive: {
    hover: "#374151",
    pressed: "#4B5563",
    disabled: "#6B7280",
  },
};

interface ThemeContextType {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export type { ThemeMode };
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("auto");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedMode = await AsyncStorage.getItem("theme_mode");
      if (
        savedMode &&
        (savedMode === "light" || savedMode === "dark" || savedMode === "auto")
      ) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    } finally {
      setIsInitialized(true);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem("theme_mode", mode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const getEffectiveTheme = (): "light" | "dark" => {
    if (themeMode === "auto") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themeMode;
  };

  const isDark = getEffectiveTheme() === "dark";
  const colors = isDark ? darkTheme : lightTheme;

  const theme: Theme = {
    mode: themeMode,
    colors,
  };

  if (!isInitialized) {
    return null; // Or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
