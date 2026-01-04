import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function BookingSuccessScreen() {
  const { serviceTitle, date, time, address } = useLocalSearchParams<{
    serviceTitle: string;
    date: string;
    time: string;
    address: string;
  }>();

  const { theme } = useTheme();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaProvider
      className="flex-1"
      style={{ backgroundColor: theme.colors.background }}
    >
      <View className="flex-1 items-center justify-center p-5">

        {/* Success Icon */}
        <Animated.View
          className="mb-6"
          style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}
        >
          <View
            className="w-[120px] h-[120px] rounded-full items-center justify-center"
            style={{ backgroundColor: `${theme.colors.success}15` }}
          >
            <Ionicons
              name="checkmark-circle"
              size={80}
              color={theme.colors.success}
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text
            className="text-[28px] font-bold text-center mb-2"
            style={{ color: theme.colors.text }}
          >
            Booking Confirmed!
          </Text>

          <Text
            className="text-base text-center mb-8"
            style={{ color: theme.colors.textSecondary }}
          >
            Your service has been successfully booked
          </Text>
        </Animated.View>

        {/* Booking Card */}
        <Animated.View className="w-full mb-6" style={{ opacity: fadeAnim }}>
          <Card
            className="p-5 border rounded-xl"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <View className="flex-row items-center mb-5 space-x-3">
              <Ionicons name="calendar-check" size={24} color={theme.colors.primary} />
              <Text className="text-lg font-semibold" style={{ color: theme.colors.text }}>
                Booking Details
              </Text>
            </View>

            {[
              { icon: 'construct-outline', label: 'Service', value: serviceTitle || 'Service' },
              { icon: 'calendar-outline', label: 'Date', value: formatDate(date) },
              { icon: 'time-outline', label: 'Time', value: time || 'Not specified' },
              { icon: 'location-outline', label: 'Address', value: address || 'Not specified' },
            ].map((item, index) => (
              <View key={index} className="flex-row justify-between mb-4">
                <View className="flex-row items-center space-x-2 flex-1">
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                  <Text className="text-sm" style={{ color: theme.colors.textSecondary }}>
                    {item.label}
                  </Text>
                </View>

                <Text
                  className="text-sm font-medium flex-1 text-right"
                  style={{ color: theme.colors.text }}
                  numberOfLines={2}
                >
                  {item.value}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Info Box */}
        <Animated.View className="w-full mb-6" style={{ opacity: fadeAnim }}>
          <View
            className="flex-row p-4 rounded-xl space-x-3"
            style={{ backgroundColor: `${theme.colors.primary}10` }}
          >
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <View className="flex-1">
              <Text className="text-base font-semibold mb-1" style={{ color: theme.colors.text }}>
                What's Next?
              </Text>
              <Text
                className="text-sm leading-5"
                style={{ color: theme.colors.textSecondary }}
              >
                You'll receive a confirmation call from our team shortly. Our service provider will
                arrive at the scheduled time.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View className="w-full space-y-3" style={{ opacity: fadeAnim }}>
          <Button
            title="View My Bookings"
            onPress={() => router.replace('/(tabs)/bookings')}
            fullWidth
          />
          <Button
            title="Book Another Service"
            onPress={() => router.replace('/(tabs)')}
            variant="outline"
            fullWidth
          />
        </Animated.View>

      </View>
    </SafeAreaProvider>
  );
}
