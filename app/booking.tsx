import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  serviceCategories,
  getCategoryName,
  getCategoryColor,
  type Service,
} from '@/lib/data/services';
import { bookingApi } from '@/lib/api/booking';
import { useApp } from '@/contexts/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type BookingStep = 1 | 2 | 3 | 4 | 5;

const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash on Service', icon: 'cash-outline' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
  { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
  { id: 'wallet', name: 'Wallet', icon: 'wallet-outline' },
];

export default function BookingScreen() {
  const { serviceId, serviceTitle, category } = useLocalSearchParams<{
    serviceId: string;
    serviceTitle: string;
    category: string;
  }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { setLoading, setError, error: appError, isLoading: appLoading } = useApp();

  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get service details
  const services = serviceCategories[category || ''] || [];
  const service = services.find((s) => s.id === serviceId) || services[0];
  const categoryColor = getCategoryColor(category || '');

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const validateStep = (step: BookingStep): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!selectedDate) newErrors.date = 'Please select a date';
      if (!selectedTime) newErrors.time = 'Please select a time';
    } else if (step === 2) {
      if (!address.trim()) newErrors.address = 'Address is required';
      if (address.trim().length < 10) newErrors.address = 'Please provide a complete address';
    } else if (step === 3) {
      if (!phone.trim()) newErrors.phone = 'Phone number is required';
      if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    } else if (step === 4) {
      if (!paymentMethod) newErrors.payment = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep((currentStep + 1) as BookingStep);
      } else {
        handleConfirm();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as BookingStep);
    } else {
      router.back();
    }
  };

  const handleConfirm = async () => {
    if (!service || !selectedDate || !selectedTime) return;

    try {
      setLoading(true);
      setError(null);

      // Create booking via API
      const bookingData = {
        serviceId: service.id,
        serviceTitle: serviceTitle || service.title,
        category: category || '',
        date: selectedDate.toISOString(),
        time: selectedTime,
        address,
        landmark: landmark || undefined,
        phone,
        instructions: instructions || undefined,
        paymentMethod,
        price: service.price,
        latitude: location?.latitude,
        longitude: location?.longitude,
      };

      const booking = await bookingApi.createBooking(bookingData);

      // Navigate to success screen with booking details
      router.push({
        pathname: '/booking-success',
        params: {
          bookingId: booking.id,
          serviceTitle: serviceTitle || service?.title,
          date: selectedDate.toISOString(),
          time: selectedTime,
          address,
        },
      } as any);
    } catch (error: any) {
      setError(error.message || 'Failed to create booking. Please try again.');
      // Optionally, you could show an error modal or toast here
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const basePrice = parseInt(service?.price.replace('₹', '').replace(',', '') || '0');
    // Add any additional charges here
    return basePrice;
  };

  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      setError(null);

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get your current address. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
        setIsGettingLocation(false);
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      // Reverse geocode to get address
      const geocodeResult = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocodeResult && geocodeResult.length > 0) {
        const addressData = geocodeResult[0];
        const formattedAddress = [
          addressData.streetNumber,
          addressData.street,
          addressData.district,
          addressData.city,
          addressData.region,
          addressData.postalCode,
          addressData.country,
        ]
          .filter(Boolean)
          .join(', ');

        setAddress(formattedAddress);
        setErrors({ ...errors, address: '' });
      } else {
        // Fallback: show coordinates if address not available
        setAddress(`${latitude}, ${longitude}`);
      }
    } catch (error: any) {
      console.error('Error getting location:', error);
      setError('Failed to get your location. Please enter address manually.');
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please enter your address manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const renderProgressBar = () => {
    const progress = (currentStep / 5) * 100;
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: categoryColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          Step {currentStep} of 5
        </Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Select Date & Time</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Choose a convenient date and time for your service
      </Text>

      <View style={styles.dateSection}>
        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {getNextAvailableDates().map((date, index) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedDate(date);
                  setErrors({ ...errors, date: '' });
                }}
                style={[
                  styles.dateCard,
                  {
                    backgroundColor: isSelected
                      ? categoryColor
                      : theme.colors.surface,
                    borderColor: isSelected ? categoryColor : theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.dateDay,
                    { color: isSelected ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}>
                  {formatDate(date).split(' ')[0]}
                </Text>
                <Text
                  style={[
                    styles.dateNumber,
                    { color: isSelected ? '#FFFFFF' : theme.colors.text },
                  ]}>
                  {date.getDate()}
                </Text>
                <Text
                  style={[
                    styles.dateMonth,
                    { color: isSelected ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}>
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {errors.date && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.date}</Text>
        )}
      </View>

      <View style={styles.timeSection}>
        <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>Select Time</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                onPress={() => {
                  setSelectedTime(time);
                  setErrors({ ...errors, time: '' });
                }}
                style={[
                  styles.timeSlot,
                  {
                    backgroundColor: isSelected
                      ? `${categoryColor}15`
                      : theme.colors.surface,
                    borderColor: isSelected ? categoryColor : theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.timeText,
                    {
                      color: isSelected ? categoryColor : theme.colors.text,
                      fontWeight: isSelected ? '600' : '400',
                    },
                  ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {errors.time && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.time}</Text>
        )}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Service Address</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Where should we provide the service?
      </Text>

      <Input
        label="Complete Address"
        placeholder="Enter your complete address"
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          setErrors({ ...errors, address: '' });
        }}
        error={errors.address}
        leftIcon="location-outline"
        multiline
        numberOfLines={3}
        style={styles.addressInput}
      />

      {/* Get Current Location Button */}
      <TouchableOpacity
        onPress={getCurrentLocation}
        disabled={isGettingLocation}
        style={[
          styles.gpsButton,
          {
            backgroundColor: isGettingLocation
              ? theme.colors.border
              : `${categoryColor}15`,
            borderColor: categoryColor,
          },
        ]}>
        {isGettingLocation ? (
          <ActivityIndicator size="small" color={categoryColor} />
        ) : (
          <Ionicons name="navigate" size={20} color={categoryColor} />
        )}
        <Text
          style={[
            styles.gpsButtonText,
            {
              color: categoryColor,
              opacity: isGettingLocation ? 0.6 : 1,
            },
          ]}>
          {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
        </Text>
      </TouchableOpacity>

      {location && (
        <View
          style={[
            styles.locationInfo,
            {
              backgroundColor: `${categoryColor}10`,
              borderColor: categoryColor,
            },
          ]}>
          <Ionicons name="checkmark-circle" size={16} color={categoryColor} />
          <Text style={[styles.locationInfoText, { color: theme.colors.textSecondary }]}>
            Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      <Input
        label="Landmark (Optional)"
        placeholder="Nearby landmark for easy location"
        value={landmark}
        onChangeText={setLandmark}
        leftIcon="flag-outline"
      />

      <TouchableOpacity
        style={[
          styles.addAddressButton,
          {
            backgroundColor: `${categoryColor}15`,
            borderColor: categoryColor,
          },
        ]}>
        <Ionicons name="add-circle-outline" size={20} color={categoryColor} />
        <Text style={[styles.addAddressText, { color: categoryColor }]}>
          Use Saved Address
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Contact Details</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        We'll use this to confirm your booking
      </Text>

      <Input
        label="Phone Number"
        placeholder="Enter your phone number"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setErrors({ ...errors, phone: '' });
        }}
        error={errors.phone}
        leftIcon="call-outline"
        keyboardType="phone-pad"
        autoComplete="tel"
      />

      <Input
        label="Special Instructions (Optional)"
        placeholder="Any special requirements or instructions"
        value={instructions}
        onChangeText={setInstructions}
        leftIcon="document-text-outline"
        multiline
        numberOfLines={4}
        style={styles.instructionsInput}
      />
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Payment Method</Text>
      <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
        Choose how you'd like to pay
      </Text>

      <View style={styles.paymentMethods}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = paymentMethod === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              onPress={() => {
                setPaymentMethod(method.id);
                setErrors({ ...errors, payment: '' });
              }}
              style={[
                styles.paymentCard,
                {
                  backgroundColor: isSelected
                    ? `${categoryColor}15`
                    : theme.colors.surface,
                  borderColor: isSelected ? categoryColor : theme.colors.border,
                },
              ]}>
              <View style={styles.paymentCardLeft}>
                <View
                  style={[
                    styles.paymentIcon,
                    { backgroundColor: isSelected ? categoryColor : `${categoryColor}15` },
                  ]}>
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={isSelected ? '#FFFFFF' : categoryColor}
                  />
                </View>
                <Text style={[styles.paymentName, { color: theme.colors.text }]}>
                  {method.name}
                </Text>
              </View>
              {isSelected && (
                <Ionicons name="checkmark-circle" size={24} color={categoryColor} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {errors.payment && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.payment}</Text>
      )}
    </View>
  );

  const renderStep5 = () => {
    const total = calculateTotal();
    return (
      <View style={styles.stepContainer}>
        <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Review & Confirm</Text>
        <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
          Please review your booking details
        </Text>

        <Card
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.serviceIcon, { backgroundColor: `${categoryColor}15` }]}>
              <Text style={styles.serviceEmoji}>{service?.image}</Text>
            </View>
            <View style={styles.summaryServiceInfo}>
              <Text style={[styles.summaryServiceTitle, { color: theme.colors.text }]}>
                {serviceTitle || service?.title}
              </Text>
              <Text style={[styles.summaryServiceCategory, { color: theme.colors.textSecondary }]}>
                {getCategoryName(category || '')}
              </Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="calendar-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Date
              </Text>
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {selectedDate ? formatDate(selectedDate) : 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="time-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Time
              </Text>
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {selectedTime || 'Not selected'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="location-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Address
              </Text>
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]} numberOfLines={2}>
              {address || 'Not provided'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="call-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Phone
              </Text>
            </View>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              {phone || 'Not provided'}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.text }]}>Service Charge</Text>
            <Text style={[styles.priceValue, { color: theme.colors.text }]}>
              {service?.price || '₹0'}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: theme.colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalPrice, { color: categoryColor }]}>₹{total}</Text>
          </View>
        </Card>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border },
        ]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Book Service</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            {serviceTitle || service?.title}
          </Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {renderProgressBar()}

      {appError && (
        <View
          style={[
            styles.errorBanner,
            {
              backgroundColor: `${theme.colors.error}15`,
              borderColor: theme.colors.error,
            },
          ]}>
          <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
          <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>
            {appError}
          </Text>
          <TouchableOpacity onPress={() => setError(null)}>
            <Ionicons name="close" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        ]}>
        <View style={[styles.footerContent, currentStep === 5 && styles.footerContentWithTotal]}>
          {currentStep === 5 && (
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: categoryColor }]}>
                ₹{calculateTotal()}
              </Text>
            </View>
          )}
          <Button
            title={currentStep === 5 ? 'Confirm Booking' : 'Continue'}
            onPress={handleNext}
            loading={appLoading && currentStep === 5}
            disabled={appLoading}
            fullWidth={currentStep !== 5}
            style={[styles.continueButton, { backgroundColor: categoryColor }]}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 24,
  },
  dateSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dateScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dateCard: {
    width: 70,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateDay: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  dateMonth: {
    fontSize: 11,
  },
  timeSection: {
    marginBottom: 24,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
  },
  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  gpsButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    gap: 8,
  },
  locationInfoText: {
    fontSize: 12,
    flex: 1,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginTop: 8,
    gap: 8,
  },
  addAddressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  paymentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryCard: {
    padding: 20,
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceEmoji: {
    fontSize: 32,
  },
  summaryServiceInfo: {
    flex: 1,
  },
  summaryServiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryServiceCategory: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerContentWithTotal: {
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  continueButton: {
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
  },
});
