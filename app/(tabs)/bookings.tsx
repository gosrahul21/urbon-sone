import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Status will be mapped to theme colors in the component
const bookings = [
  {
    id: 1,
    service: "Deep Home Cleaning",
    date: "Today, 2:00 PM",
    status: "confirmed" as const,
    address: "123 Main Street, City",
  },
  {
    id: 2,
    service: "AC Service & Repair",
    date: "Tomorrow, 10:00 AM",
    status: "scheduled" as const,
    address: "123 Main Street, City",
  },
  {
    id: 3,
    service: "Plumbing Solutions",
    date: "Dec 25, 3:00 PM",
    status: "completed" as const,
    address: "123 Main Street, City",
  },
];

export default function BookingsScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaProvider
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Bookings
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {bookings.map((booking) => {
          const statusColor = theme.colors.status[booking.status];
          const statusLabel =
            booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
          return (
            <TouchableOpacity
              key={booking.id}
              style={[
                styles.bookingCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <View style={styles.bookingHeader}>
                <View style={styles.serviceInfo}>
                  <Text
                    style={[styles.serviceName, { color: theme.colors.text }]}
                  >
                    {booking.service}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${statusColor}15` },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {statusLabel}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={[styles.detailText, { color: theme.colors.text }]}
                  >
                    {booking.date}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={[styles.detailText, { color: theme.colors.text }]}
                  >
                    {booking.address}
                  </Text>
                </View>
              </View>
              {booking.status === "confirmed" && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
                    View Details
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
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
  bookingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  bookingHeader: {
    marginBottom: 16,
  },
  serviceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookingDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
