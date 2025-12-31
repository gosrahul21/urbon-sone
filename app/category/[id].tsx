import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { categoryImages, serviceImages } from '@/lib/data/categoryImages';

// Service categories data
const categoryData: Record<string, any> = {
  plumbing: {
    name: 'Plumbing',
    icon: 'water',
    color: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400',
    description: 'Expert plumbing solutions for your home',
    services: [
      {
        id: 1,
        title: 'Leak Repair',
        price: '₹499',
        duration: '1-2 hours',
        rating: 4.8,
        reviews: 1250,
        description: 'Fix all types of leaks and drips',
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300',
      },
      {
        id: 2,
        title: 'Pipe Installation',
        price: '₹1,299',
        duration: '2-3 hours',
        rating: 4.9,
        reviews: 890,
        description: 'Professional pipe installation and replacement',
        image: serviceImages.plumbing[2],
      },
      {
        id: 3,
        title: 'Bathroom Fitting',
        price: '₹899',
        duration: '2-4 hours',
        rating: 4.7,
        reviews: 2100,
        description: 'Install and repair bathroom fixtures',
        image: serviceImages.plumbing[3],
      },
      {
        id: 4,
        title: 'Drain Cleaning',
        price: '₹599',
        duration: '1 hour',
        rating: 4.6,
        reviews: 1500,
        description: 'Unclog and clean blocked drains',
        image: serviceImages.plumbing[4],
      },
      {
        id: 5,
        title: 'Water Heater Repair',
        price: '₹799',
        duration: '1-2 hours',
        rating: 4.9,
        reviews: 980,
        description: 'Repair and service water heaters',
        image: serviceImages.plumbing[5],
      },
    ],
  },
  cleaning: {
    name: 'Cleaning',
    icon: 'sparkles',
    color: '#10B981',
    image: categoryImages.cleaning,
    description: 'Professional cleaning services for your space',
    services: [
      {
        id: 1,
        title: 'Deep Home Cleaning',
        price: '₹999',
        duration: '3-4 hours',
        rating: 4.8,
        reviews: 2500,
        description: 'Complete deep cleaning of your entire home',
        image: serviceImages.cleaning[1],
      },
      {
        id: 2,
        title: 'Kitchen Cleaning',
        price: '₹599',
        duration: '2 hours',
        rating: 4.9,
        reviews: 1800,
        description: 'Thorough kitchen cleaning and sanitization',
        image: serviceImages.cleaning[2],
      },
      {
        id: 3,
        title: 'Bathroom Cleaning',
        price: '₹499',
        duration: '1-2 hours',
        rating: 4.7,
        reviews: 2200,
        description: 'Deep cleaning and sanitization of bathrooms',
        image: serviceImages.cleaning[3],
      },
      {
        id: 4,
        title: 'Window Cleaning',
        price: '₹399',
        duration: '1 hour',
        rating: 4.6,
        reviews: 1200,
        description: 'Interior and exterior window cleaning',
        image: serviceImages.cleaning[4],
      },
      {
        id: 5,
        title: 'Carpet Cleaning',
        price: '₹799',
        duration: '2-3 hours',
        rating: 4.8,
        reviews: 950,
        description: 'Professional carpet and upholstery cleaning',
        image: serviceImages.cleaning[5],
      },
    ],
  },
  electrical: {
    name: 'Electrical',
    icon: 'flash',
    color: '#F59E0B',
    image: categoryImages.electrical,
    description: 'Safe and reliable electrical services',
    services: [
      {
        id: 1,
        title: 'Wiring Installation',
        price: '₹1,499',
        duration: '3-4 hours',
        rating: 4.9,
        reviews: 1100,
        description: 'Complete electrical wiring for new construction',
        image: serviceImages.electrical[1],
      },
      {
        id: 2,
        title: 'Switch & Socket Repair',
        price: '₹299',
        duration: '1 hour',
        rating: 4.7,
        reviews: 1900,
        description: 'Repair and replace switches and sockets',
        image: serviceImages.electrical[2],
      },
      {
        id: 3,
        title: 'Fan Installation',
        price: '₹499',
        duration: '1-2 hours',
        rating: 4.8,
        reviews: 1600,
        description: 'Install ceiling and exhaust fans',
        image: serviceImages.electrical[3],
      },
      {
        id: 4,
        title: 'Light Fixture Installation',
        price: '₹399',
        duration: '1-2 hours',
        rating: 4.6,
        reviews: 1400,
        description: 'Install various light fixtures',
        image: serviceImages.electrical[4],
      },
      {
        id: 5,
        title: 'MCB & Fuse Repair',
        price: '₹599',
        duration: '1-2 hours',
        rating: 4.9,
        reviews: 1300,
        description: 'Repair and replace MCB and fuse boxes',
        image: serviceImages.electrical[5],
      },
    ],
  },
  carpentry: {
    name: 'Carpentry',
    icon: 'hammer',
    color: '#8B5CF6',
    image: categoryImages.carpentry,
    description: 'Expert carpentry and woodwork services',
    services: [
      {
        id: 1,
        title: 'Furniture Repair',
        price: '₹699',
        duration: '2-3 hours',
        rating: 4.8,
        reviews: 1200,
        description: 'Repair and restore damaged furniture',
        image: serviceImages.carpentry[1],
      },
      {
        id: 2,
        title: 'Custom Furniture',
        price: '₹2,999',
        duration: '1-2 days',
        rating: 4.9,
        reviews: 850,
        description: 'Custom-made furniture as per your requirements',
        image: serviceImages.carpentry[2],
      },
      {
        id: 3,
        title: 'Door & Window Repair',
        price: '₹899',
        duration: '2-3 hours',
        rating: 4.7,
        reviews: 1800,
        description: 'Repair and install doors and windows',
        image: serviceImages.carpentry[3],
      },
      {
        id: 4,
        title: 'Shelf Installation',
        price: '₹499',
        duration: '1-2 hours',
        rating: 4.6,
        reviews: 1100,
        description: 'Install wall shelves and storage units',
        image: serviceImages.carpentry[4],
      },
      {
        id: 5,
        title: 'Cabinet Making',
        price: '₹1,999',
        duration: '1-2 days',
        rating: 4.8,
        reviews: 950,
        description: 'Custom kitchen and wardrobe cabinets',
        image: serviceImages.carpentry[5],
      },
    ],
  },
  painting: {
    name: 'Painting',
    icon: 'brush',
    color: '#EC4899',
    image: categoryImages.painting,
    description: 'Professional painting and color solutions',
    services: [
      {
        id: 1,
        title: 'Interior Painting',
        price: '₹1,999',
        duration: '1-2 days',
        rating: 4.8,
        reviews: 2000,
        description: 'Complete interior wall painting',
        image: serviceImages.painting[1],
      },
      {
        id: 2,
        title: 'Exterior Painting',
        price: '₹2,499',
        duration: '2-3 days',
        rating: 4.7,
        reviews: 1500,
        description: 'Exterior wall painting and waterproofing',
        image: serviceImages.painting[2],
      },
      {
        id: 3,
        title: 'Wall Texture',
        price: '₹1,299',
        duration: '1-2 days',
        rating: 4.9,
        reviews: 1100,
        description: 'Create beautiful wall textures',
        image: serviceImages.painting[3],
      },
      {
        id: 4,
        title: 'Wood Polish',
        price: '₹899',
        duration: '1 day',
        rating: 4.6,
        reviews: 1300,
        description: 'Polish and varnish wooden surfaces',
        image: serviceImages.painting[4],
      },
    ],
  },
  'ac-repair': {
    name: 'AC Repair',
    icon: 'snow',
    color: '#06B6D4',
    image: categoryImages['ac-repair'],
    description: 'AC service and repair solutions',
    services: [
      {
        id: 1,
        title: 'AC Service',
        price: '₹599',
        duration: '1-2 hours',
        rating: 4.9,
        reviews: 2800,
        description: 'Complete AC servicing and cleaning',
        image: serviceImages['ac-repair'][1],
      },
      {
        id: 2,
        title: 'AC Installation',
        price: '₹1,499',
        duration: '2-3 hours',
        rating: 4.8,
        reviews: 1200,
        description: 'Professional AC installation',
        image: serviceImages['ac-repair'][2],
      },
      {
        id: 3,
        title: 'Gas Refilling',
        price: '₹1,299',
        duration: '1-2 hours',
        rating: 4.7,
        reviews: 1900,
        description: 'AC gas refilling and leak repair',
        image: serviceImages['ac-repair'][3],
      },
      {
        id: 4,
        title: 'AC Repair',
        price: '₹899',
        duration: '1-2 hours',
        rating: 4.8,
        reviews: 2100,
        description: 'Repair all AC issues',
        image: serviceImages['ac-repair'][4],
      },
    ],
  },
  appliance: {
    name: 'Appliance',
    icon: 'tv',
    color: '#F97316',
    image: categoryImages.appliance,
    description: 'Home appliance repair and service',
    services: [
      {
        id: 1,
        title: 'Washing Machine Repair',
        price: '₹699',
        duration: '1-2 hours',
        rating: 4.8,
        reviews: 1600,
        description: 'Repair all washing machine issues',
        image: serviceImages.appliance[1],
      },
      {
        id: 2,
        title: 'Refrigerator Repair',
        price: '₹799',
        duration: '1-2 hours',
        rating: 4.9,
        reviews: 1800,
        description: 'Fix refrigerator cooling and other issues',
        image: serviceImages.appliance[2],
      },
      {
        id: 3,
        title: 'Microwave Repair',
        price: '₹499',
        duration: '1 hour',
        rating: 4.7,
        reviews: 1200,
        description: 'Repair microwave ovens',
        image: serviceImages.appliance[3],
      },
      {
        id: 4,
        title: 'TV Repair',
        price: '₹899',
        duration: '1-2 hours',
        rating: 4.6,
        reviews: 1400,
        description: 'Repair LED, LCD, and smart TVs',
        image: serviceImages.appliance[4],
      },
    ],
  },
  'pest-control': {
    name: 'Pest Control',
    icon: 'bug',
    color: '#84CC16',
    image: categoryImages['pest-control'],
    description: 'Effective pest control solutions',
    services: [
      {
        id: 1,
        title: 'Cockroach Control',
        price: '₹599',
        duration: '1-2 hours',
        rating: 4.8,
        reviews: 2200,
        description: 'Complete cockroach elimination',
        image: serviceImages['pest-control'][1],
      },
      {
        id: 2,
        title: 'Ant Control',
        price: '₹499',
        duration: '1 hour',
        rating: 4.7,
        reviews: 1800,
        description: 'Effective ant removal and prevention',
        image: serviceImages['pest-control'][2],
      },
      {
        id: 3,
        title: 'Rodent Control',
        price: '₹799',
        duration: '1-2 hours',
        rating: 4.9,
        reviews: 1500,
        description: 'Rat and mouse control',
        image: serviceImages['pest-control'][3],
      },
      {
        id: 4,
        title: 'Termite Treatment',
        price: '₹1,299',
        duration: '2-3 hours',
        rating: 4.8,
        reviews: 1100,
        description: 'Complete termite treatment',
        image: serviceImages['pest-control'][4],
      },
    ],
  },
};

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  const category = categoryData[id || 'plumbing'];
  const categoryKey = id || 'plumbing';

  if (!category) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            Category not found
          </Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const handleBookService = (serviceId: number) => {
    // Find the service from the category
    const service = category.services.find((s: any) => s.id === serviceId);
    
    if (!service) {
      console.error('Service not found');
      return;
    }

    // Navigate to booking screen with service details
    router.push({
      pathname: '/booking',
      params: {
        serviceId: service.id.toString(),
        serviceTitle: service.title,
        category: categoryKey,
        price: service.price,
        duration: service.duration,
      },
    } as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
            {category.image ? (
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
                contentFit="cover"
              />
            ) : (
              <Ionicons name={category.icon as any} size={28} color={category.color} />
            )}
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{category.name}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {category.services.length} services available
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            {category.description}
          </Text>
        </View>

        {/* Services List */}
        <View style={styles.servicesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Available Services</Text>
          {category.services.map((service: any) => (
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
                <View style={[styles.serviceImage, { backgroundColor: `${category.color}10` }]}>
                  {service.image && service.image.startsWith('http') ? (
                    <Image
                      source={{ uri: service.image }}
                      style={styles.serviceImageContent}
                      contentFit="cover"
                    />
                  ) : (
                    <Text style={styles.serviceEmoji}>{service.image}</Text>
                  )}
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceTitle, { color: theme.colors.text }]}>
                    {service.title}
                  </Text>
                  <View style={styles.serviceMeta}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FBBF24" />
                      <Text style={[styles.rating, { color: theme.colors.text }]}>
                        {service.rating}
                      </Text>
                      <Text style={[styles.reviews, { color: theme.colors.textSecondary }]}>
                        ({service.reviews})
                      </Text>
                    </View>
                    <View style={styles.durationContainer}>
                      <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                      <Text style={[styles.duration, { color: theme.colors.textSecondary }]}>
                        {service.duration}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={[styles.serviceDescription, { color: theme.colors.textSecondary }]}>
                {service.description}
              </Text>
              <View style={styles.serviceFooter}>
                <View>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                    Starting at
                  </Text>
                  <Text style={[styles.price, { color: category.color }]}>{service.price}</Text>
                </View>
                <Button
                  title="Book Now"
                  onPress={() => handleBookService(service.id)}
                  variant="primary"
                  size="small"
                  style={[styles.bookButton, { backgroundColor: category.color }]}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginRight: 16,
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  categoryImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  descriptionContainer: {
    padding: 20,
    paddingBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  servicesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  serviceCard: {
    marginBottom: 16,
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  serviceImageContent: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  serviceEmoji: {
    fontSize: 32,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviews: {
    fontSize: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    fontSize: 12,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  bookButton: {
    minWidth: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

