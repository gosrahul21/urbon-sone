import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { requestOtp, verifyOtp, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    phone?: string;
    otp?: string;
  }>({});

  const validatePhone = () => {
    if (!phone.trim()) {
      setFormErrors({ phone: "Phone number is required" });
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      setFormErrors({ phone: "Enter valid 10-digit phone number" });
      return false;
    }
    return true;
  };

  const validateOtp = () => {
    if (!otp.trim()) {
      setFormErrors({ otp: "OTP is required" });
      return false;
    }
    if (otp.length !== 6) {
      setFormErrors({ otp: "OTP must be 6 digits" });
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    clearError();
    if (!validatePhone()) return;

    await requestOtp(phone);
    setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    try {
      clearError();
      if (!validateOtp()) return;

      await verifyOtp({ phoneNo: phone, otp });
    } catch (error) {}
  };

  return (
    <SafeAreaProvider
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <View
              style={[
                styles.logoContainer,
                { backgroundColor: `${theme.colors.primary}15` },
              ]}
            >
              <Ionicons
                name="lock-closed"
                size={44}
                color={theme.colors.primary}
              />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {otpSent ? "Verify OTP" : "Welcome Back"}
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              {otpSent
                ? `OTP sent to +91 ${phone}`
                : "Login using your phone number"}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error && (
              <View
                style={[
                  styles.errorContainer,
                  { backgroundColor: `${theme.colors.error}15` },
                ]}
              >
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={theme.colors.error}
                />
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
              </View>
            )}

            {!otpSent ? (
              <Input
                label="Phone Number"
                placeholder="Enter 10-digit phone number"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/\D/g, ""));
                  if (formErrors.phone) setFormErrors({});
                }}
                error={formErrors.phone}
                leftIcon="call-outline"
                keyboardType="number-pad"
                maxLength={10}
              />
            ) : (
              <Input
                label="OTP"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={(text) => {
                  setOtp(text.replace(/\D/g, ""));
                  if (formErrors.otp) setFormErrors({});
                }}
                error={formErrors.otp}
                leftIcon="key-outline"
                keyboardType="number-pad"
                maxLength={6}
              />
            )}

            <Button
              title={otpSent ? "Verify OTP" : "Send OTP"}
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
              loading={isLoading}
              fullWidth
              style={styles.loginButton}
            />

            {otpSent && (
              <TouchableOpacity onPress={() => setOtpSent(false)}>
                <Text
                  style={[styles.resendText, { color: theme.colors.primary }]}
                >
                  Change phone number
                </Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                OR
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            </View>

            {/* Google Sign-in (unchanged) */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  { borderColor: theme.colors.border },
                ]}
              >
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  logoSection: { alignItems: "center", marginTop: 20, marginBottom: 40 },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: "center" },
  form: { flex: 1 },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { flex: 1, fontSize: 14 },
  loginButton: { marginTop: 16, marginBottom: 12 },
  resendText: { textAlign: "center", fontWeight: "600" },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 14 },
  socialButtons: { flexDirection: "row", justifyContent: "center" },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
