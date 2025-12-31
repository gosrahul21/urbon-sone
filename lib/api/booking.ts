import { apiClient, ApiError } from './client';

export interface CreateBookingData {
  serviceId: string;
  serviceTitle: string;
  category: string;
  date: string;
  time: string;
  address: string;
  landmark?: string;
  phone: string;
  instructions?: string;
  paymentMethod: string;
  price: string;
  latitude?: number;
  longitude?: number;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  category: string;
  date: string;
  time: string;
  address: string;
  landmark?: string;
  phone: string;
  instructions?: string;
  paymentMethod: string;
  price: string;
  status: 'pending' | 'confirmed' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const bookingApi = {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>('/bookings', data);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  async getBookings(): Promise<Booking[]> {
    try {
      const response = await apiClient.get<Booking[]>('/bookings');
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiClient.get<Booking>(`/bookings/${id}`);
      return response;
    } catch (error) {
      throw error as ApiError;
    }
  },

  async cancelBooking(id: string): Promise<void> {
    try {
      await apiClient.delete(`/bookings/${id}`);
    } catch (error) {
      throw error as ApiError;
    }
  },
};

