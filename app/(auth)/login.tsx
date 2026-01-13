import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // Added for loading state
} from "react-native";
import * as Notifications from 'expo-notifications';
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

// 1. Google Auth Imports
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { triggerNotification } from "@/helper/notification";

// 2. Initialize WebBrowser to handle redirects
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // Assuming your AuthContext might have a method for social login, 
  // otherwise we handle the logic here and pass the user to a general login method.
  const { requestOtp, verifyOtp, isLoading, error, clearError, googleLogin } = useAuth();
  const { theme } = useTheme();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [formErrors, setFormErrors] = useState<{ phone?: string; otp?: string }>({});

  // 3. Google Auth Configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    // REPLACE these with your actual Client IDs from Google Cloud Console
    androidClientId: "413773176963-fofbf9rfb5s49ljd6hb681be7hb8llcf.apps.googleusercontent.com",
    iosClientId: "",
    webClientId: "413773176963-f3r41461irvbjq00pboait6hd6aikf12.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@gosrahul21/mobile",
  });

  console.log(makeRedirectUri({ useProxy: true }))
  // 4. Handle Google Response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response as any;
      handleGoogleSignIn(authentication?.accessToken);
    }
  }, [response]);

  // 5. Fetch Google User Data
  const handleGoogleSignIn = async (accessToken: string) => {
    try {
      // Option A: Send the token directly to your backend (Recommended)
      // await googleLogin(accessToken); 

      // Option B: Fetch user info here, then send to backend
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const user = await response.json();
      
      console.log("Google User Data:", user); 
      // Example output: { id: "...", email: "...", name: "...", picture: "..." }
      
      // Now call your Auth Context to save the user/session
      // await loginWithSocialProvider(user); 
      
    } catch (error) {
      console.log("Google Sign-In Error", error);
    }
  };

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

  // 2. Request Permissions on App Start
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission needed', 'Please enable notifications in settings');
        }
      }
    }
    
    requestPermissions();

    // Android specific: Create a channel (required for Android 8+)
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }, []);

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
              // onPress={triggerNotification}
              loading={isLoading}
              fullWidth
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

            {/* 6. Updated Google Sign-in Button */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                disabled={!request} // Disable if hooks aren't ready
                onPress={() => {
                  promptAsync();
                }}
                style={[
                  styles.socialButton,
                  { borderColor: theme.colors.border },
                ]}
                className="flex-row "
              >
                 {/* Optional: Add a spinner if the Google button is loading */}
                 <Ionicons
                    name="logo-google"
                    size={24}
                    color={theme.colors.text}
                  />
                  {/* If you want text next to icon:  */}
                  <Text style={{ color: theme.colors.text}}>Google</Text> 
                 
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
  socialButtons: { flexDirection: "row", justifyContent: "center", gap:2, paddingHorizontal: 10 },
  socialButton: {
    // width: 56, // Increased slightly for better touch area
    // height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'transparent'
  },
});