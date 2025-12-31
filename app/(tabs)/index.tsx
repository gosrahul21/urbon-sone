import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { BannerCarousel } from '@/components/BannerCarousel';
import { trendingBanners } from '@/lib/data/trendingBanners';

const { width } = Dimensions.get('window');

const services = [
  {
    id: 1,
    name: 'Plumbing',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200',
    color: '#3B82F6',
    route: 'plumbing',
  },
  {
    id: 2,
    name: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
    color: '#10B981',
    route: 'cleaning',
  },
  {
    id: 3,
    name: 'Electrical',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200',
    color: '#F59E0B',
    route: 'electrical',
  },
  {
    id: 4,
    name: 'Carpentry',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200',
    color: '#8B5CF6',
    route: 'carpentry',
  },
  {
    id: 5,
    name: 'Painting',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200',
    color: '#EC4899',
    route: 'painting',
  },
  {
    id: 6,
    name: 'AC Repair',
    image: 'https://images.unsplash.com/photo-1631540575400-4e0a3b2c0e5e?w=200',
    color: '#06B6D4',
    route: 'ac-repair',
  },
  {
    id: 7,
    name: 'Appliance',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200',
    color: '#F97316',
    route: 'appliance',
  },
  {
    id: 8,
    name: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200',
    color: '#84CC16',
    route: 'pest-control',
  },
];

const popularServices = [
  {
    id: 1,
    title: 'Deep Home Cleaning',
    price: '₹999',
    rating: 4.8,
    reviews: 1250,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
  },
  {
    id: 2,
    title: 'AC Service & Repair',
    price: '₹599',
    rating: 4.9,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1631540575400-4e0a3b2c0e5e?w=300',
  },
  {
    id: 3,
    title: 'Plumbing Solutions',
    price: '₹399',
    rating: 4.7,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300',
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
          {/* <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>Hello,</Text>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{userName} 👋</Text>
          </View> */}
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
            <View style={[styles.badge, { backgroundColor: theme.colors.error }]} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.searchText, { color: theme.colors.textSecondary }]}>
            Search for services...
          </Text>
        </TouchableOpacity>

        {/* Trending Banners Carousel */}
        <View style={styles.bannerSection}>
          <BannerCarousel banners={trendingBanners} autoScrollInterval={4000} />
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(`/category/${service.route}` as any)}>
                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                  <Image
                    source={{ uri: service.image }}
                    style={styles.serviceImage}
                    contentFit="cover"
                  />
                </View>
                <Text style={[styles.serviceName, { color: theme.colors.text }]}>
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Popular Services
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {popularServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.popularCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <View style={[styles.popularImage, { backgroundColor: theme.colors.background }]}>
                  <Image
                    source={{ uri: service.image }}
                    style={styles.popularServiceImage}
                    contentFit="cover"
                  />
                </View>
                <View style={styles.popularContent}>
                  <Text style={[styles.popularTitle, { color: theme.colors.text }]}>
                    {service.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text style={[styles.rating, { color: theme.colors.text }]}>
                      {service.rating}
                    </Text>
                    <Text style={[styles.reviews, { color: theme.colors.textSecondary }]}>
                      ({service.reviews})
                    </Text>
                  </View>
                  <Text style={[styles.price, { color: theme.colors.primary }]}>
                    Starting at {service.price}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Ionicons name="gift-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Offers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Support</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchText: {
    marginLeft: 12,
    fontSize: 16,
  },
  bannerContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  banner: {
    padding: 20,
    backgroundColor: '#00D9A5',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#00D9A5',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 60) / 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  serviceImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  popularCard: {
    width: width * 0.75,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  popularImage: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  popularServiceImage: {
    width: '100%',
    height: '100%',
  },
  bannerSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  popularContent: {
    padding: 16,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
});
