import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  className =`bg-primary`,
  textClassName,
}: ButtonProps) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;

  /** ----------------------------
   * Base Classes
   ----------------------------- */
  const baseButton = "rounded-xl flex-row items-center justify-center";

  /** ----------------------------
   * Size Classes
   ----------------------------- */
  const sizeMap = {
    small: "px-4 py-2 min-h-[36px]",
    medium: "px-6 py-3 min-h-[48px]",
    large: "px-8 py-4 min-h-[56px]",
  };

  /** ----------------------------
   * Variant Classes
   * (Theme colors injected safely)
   ----------------------------- */
  const variantMap = {
    primary: `bg-[${isDisabled ? theme.colors.border : theme.colors.primary}]`,
    secondary: `bg-[${
      isDisabled ? theme.colors.border : theme.colors.secondary
    }]`,
    outline: `border-2 border-[${
      isDisabled ? theme.colors.border : theme.colors.primary
    }] bg-transparent`,
    ghost: "bg-transparent",
  };

  /** ----------------------------
   * Text Classes
   ----------------------------- */
  const textBase = "font-semibold";

  const textSizeMap = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const textVariantMap = {
    primary: "text-white",
    secondary: "text-white",
    outline: `text-[${
      isDisabled ? theme.colors.border : theme.colors.primary
    }]`,
    ghost: `text-[${
      isDisabled ? theme.colors.textSecondary : theme.colors.primary
    }]`,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={onPress}
      className={[
        baseButton,
        sizeMap[size],
        variantMap[variant],
        isDisabled ? "opacity-60" : "opacity-100",
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" || variant === "secondary"
              ? "#FFFFFF"
              : theme.colors.primary
          }
        />
      ) : (
        <Text
          className={[
            textBase,
            textSizeMap[size],
            textVariantMap[variant],
            textClassName,
          ].join(" ")}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
