import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, ThemeMode } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, setThemeMode, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: "person-outline",
          title: "Edit Profile",
          onPress: () => {},
          rightIcon: "chevron-forward",
        },
        {
          icon: "lock-closed-outline",
          title: "Change Password",
          onPress: () => {},
          rightIcon: "chevron-forward",
        },
        {
          icon: "location-outline",
          title: "Saved Addresses",
          onPress: () => {},
          rightIcon: "chevron-forward",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: "notifications-outline",
          title: "Push Notifications",
          rightComponent: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.surface}
            />
          ),
        },
        {
          icon: "location-outline",
          title: "Location Services",
          rightComponent: (
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.surface}
            />
          ),
        },
        {
          icon: "moon-outline",
          title: "Theme",
          rightComponent: (
            <View style={styles.themeOptions}>
              <TouchableOpacity
                onPress={() => handleThemeChange("light")}
                style={[
                  styles.themeOption,
                  theme.mode === "light" && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.themeOptionText,
                    theme.mode === "light" && { color: theme.colors.surface },
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleThemeChange("dark")}
                style={[
                  styles.themeOption,
                  theme.mode === "dark" && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.themeOptionText,
                    theme.mode === "dark" && { color: theme.colors.surface },
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleThemeChange("auto")}
                style={[
                  styles.themeOption,
                  theme.mode === "auto" && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.themeOptionText,
                    theme.mode === "auto" && { color: theme.colors.surface },
                  ]}
                >
                  Auto
                </Text>
              </TouchableOpacity>
            </View>
          ),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: "help-circle-outline",
          title: "Help Center",
          onPress: () => {},
          rightIcon: "chevron-forward",
        },
        {
          icon: "document-text-outline",
          title: "Terms & Conditions",
          onPress: () => {},
          rightIcon: "chevron-forward",
        },
        {
          icon: "shield-checkmark-outline",
          title: "Privacy Policy",
          onPress: () => {},
          rightIcon: "chevron-forward",
        },
        {
          icon: "information-circle-outline",
          title: "About",
          onPress: () => {},
          rightIcon: "chevron-forward",
        },
      ],
    },
  ];

  return (
    <SafeAreaProvider
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.avatarText}>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "U"}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {user?.name}
              </Text>
              <Text
                style={[
                  styles.userEmail,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {user?.email}
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {section.title}
            </Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                >
                  <View style={styles.settingItemLeft}>
                    <View
                      style={[
                        styles.settingIconContainer,
                        { backgroundColor: `${theme.colors.primary}15` },
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.settingItemTitle,
                        { color: theme.colors.text },
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  {item.rightIcon && (
                    <Ionicons
                      name={item.rightIcon as any}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  )}
                  {item.rightComponent && item.rightComponent}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            {
              borderColor: theme.colors.error,
              borderWidth: 2,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text
            style={[styles.logoutButtonText, { color: theme.colors.error }]}
          >
            Logout
          </Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text
            style={[styles.versionText, { color: theme.colors.textSecondary }]}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  themeOptions: {
    flexDirection: "row",
    gap: 8,
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
  },
});
