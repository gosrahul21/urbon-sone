import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 40;

export interface TrendingBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  serviceId?: string;
  backgroundImage: string;
}

interface BannerCarouselProps {
  banners: TrendingBanner[];
  autoScrollInterval?: number;
}

export function BannerCarousel({
  banners,
  autoScrollInterval = 4000,
}: BannerCarouselProps) {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [currentIndex, banners.length, autoScrollInterval]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(offsetX / BANNER_WIDTH));
  };

  const handleBookNow = (banner: TrendingBanner) => {
    router.push({
      pathname: '/booking',
      params: {
        serviceId: banner.serviceId || '',
        serviceTitle: banner.title,
        category: banner.category,
      },
    } as any);
  };

  if (!banners.length) return null;

  return (
    <View className="">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner) => (
          <View
            key={banner.id}
            style= {{ width: BANNER_WIDTH }}
            className=""
          >          
            <View className="relative overflow-hidden h-[170px] w-full rounded-2xl  px-5 py-3">
 
              {/* Dark Overlay */}
              <View className="absolute inset-0 bg-black/40" />
              <Image
                    source={{ uri: banner.backgroundImage }}
                    style={{
                      width: BANNER_WIDTH,
                      height: 200,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    contentFit="cover"
                    priority="high"
                  />
              {/* Content */}
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-white text-[22px] font-bold mb-1">
                    {banner.title}
                  </Text>
                  <Text className="text-white/90 text-sm leading-5 mb-4">
                    {banner.subtitle}
                  </Text>

                  <Button
                    title="Book Now"
                    onPress={() => handleBookNow(banner)}
                    size="small"
                    className="bg-gray-200 px-5 py-2 self-start"
                    textClassName="text-gray-700 font-semibold text-sm"
                  />
                </View>
{/* 
                {banner.image.startsWith('http') && (
                  <View className="w-[100px] h-[100px] items-center justify-center">
                    <Image
                      source={{ uri: banner.image }}
                      className="w-[100px] h-[100px] rounded-full"
                      contentFit="cover"
                    />
                  </View>
                )} */}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination */}
      {banners.length > 1 && (
        <View className="flex-row justify-center items-center mt-3 space-x-2">
          {banners.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
