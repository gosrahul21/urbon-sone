import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

const bookings = [
  {
    id: 1,
    service: 'Deep Home Cleaning',
    date: 'Today, 2:00 PM',
    status: 'Confirmed',
    statusColor: '#10B981',
    address: '123 Main Street, City',
  },
  {
    id: 2,
    service: 'AC Service & Repair',
    date: 'Tomorrow, 10:00 AM',
    status: 'Scheduled',
    statusColor: '#3B82F6',
    address: '123 Main Street, City',
  },
  {
    id: 3,
    service: 'Plumbing Solutions',
    date: 'Dec 25, 3:00 PM',
    status: 'Completed',
    statusColor: '#6B7280',
    address: '123 Main Street, City',
  },
];

export default function BookingsScreen() {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Bookings</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {bookings.map((booking) => (
          <TouchableOpacity
            key={booking.id}
            style={[
              styles.bookingCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}>
            <View style={styles.bookingHeader}>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, { color: theme.colors.text }]}>
                  {booking.service}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: `${booking.statusColor}15` }]}>
                  <Text style={[styles.statusText, { color: booking.statusColor }]}>
                    {booking.status}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.text }]}>
                  {booking.date}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color={theme.colors.textSecondary} />
                <Text style={[styles.detailText, { color: theme.colors.text }]}>
                  {booking.address}
                </Text>
              </View>
            </View>
            {booking.status === 'Confirmed' && (
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
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
    fontWeight: '700',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#00D9A5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

