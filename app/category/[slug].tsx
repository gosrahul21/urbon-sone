import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  serviceCategories,
  getCategoryName,
  getCategoryIcon,
  getCategoryColor,
  type Service,
} from '@/lib/data/services';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { theme } = useTheme();
  
  const categoryName = getCategoryName(slug || '');
  const categoryIcon = getCategoryIcon(slug || '');
  const categoryColor = getCategoryColor(slug || '');
  const services = serviceCategories[slug || ''] || [];

  const handleBookService = (service: Service) => {
    // Navigate to booking screen with service details
    router.push({
      pathname: '/booking',
      params: {
        serviceId: service.id,
        serviceTitle: service.title,
        category: slug,
        price: service.price,
        duration: service.duration,
      },
    } as any);
  };

  return (
    <SafeAreaProvider style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.categoryIcon, { backgroundColor: `${categoryColor}15` }]}>
            <Ionicons name={categoryIcon as any} size={24} color={categoryColor} />
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{categoryName}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Category Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            {services.length} services available
          </Text>
        </View>

        {/* Services List */}
        <View style={styles.servicesList}>
          {services.map((service) => (
            <Card
              key={service.id}
              style={[
                styles.serviceCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <View style={styles.serviceHeader}>
                <View style={[styles.serviceImage, { backgroundColor: `${categoryColor}10` }]}>
                  <Text style={styles.serviceEmoji}>{service.image}</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceTitle, { color: theme.colors.text }]}>
                    {service.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text style={[styles.rating, { color: theme.colors.text }]}>
                      {service.rating}
                    </Text>
                    <Text style={[styles.reviews, { color: theme.colors.textSecondary }]}>
                      ({service.reviews} reviews)
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                {service.description}
              </Text>

              <View style={styles.serviceDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {service.duration}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                    {service.price}
                  </Text>
                </View>
              </View>

              <View style={styles.featuresContainer}>
                {service.features.map((feature, index) => (
                  <View
                    key={index}
                    style={[
                      styles.featureTag,
                      { backgroundColor: `${categoryColor}15` },
                    ]}>
                    <Ionicons name="checkmark-circle" size={14} color={categoryColor} />
                    <Text style={[styles.featureText, { color: categoryColor }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <Button
                title="Book Now"
                onPress={() => handleBookService(service)}
                fullWidth
                style={[styles.bookButton, { backgroundColor: categoryColor }]}
              />
            </Card>
          ))}
        </View>

        {services.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No services available in this category
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 14,
  },
  servicesList: {
    padding: 20,
    gap: 16,
  },
  serviceCard: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceImage: {
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
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    marginLeft: 4,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookButton: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

