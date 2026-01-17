import axios from 'axios';
import { ApiResponse, AuthResponse, Booking, BookingCreate, Location, Rating, RatingCreate, RatingWithUser, Room, SearchParams, User, UserLogin, UserRegister } from '@/types';

const API_URL = 'https://airbnbnew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NyIsIkhldEhhblN0cmluZyI6IjI3LzAzLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NDU2OTYwMDAwMCIsIm5iZiI6MTc0NzI0MjAwMCwiZXhwIjoxNzc0NzE3MjAwfQ.YJSCMUqM4JgIqsDiGq9fxRp3AOrIdxBO4t7xxj6K8dY'
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'TokenCybersoft': TOKEN_CYBERSOFT,
    'Content-Type': 'application/json',
  }
});

// Add token to requests when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const login = async (data: UserLogin): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/signin', data);
  return response.data;
};

export const register = async (data: UserRegister): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/auth/signup', data);
  return response.data;
};

// User APIs
export const getUserInfo = async (userId: number): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
  return response.data;
};

export const updateUserInfo = async (userId: number, data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(`/users/${userId}`, data);
  return response.data;
};

export const uploadAvatar = async (file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('formFile', file);
  
  const response = await api.post<ApiResponse<string>>('/users/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Location APIs
export const getLocations = async (params?: SearchParams): Promise<ApiResponse<Location[]>> => {
  const response = await api.get<ApiResponse<Location[]>>('/vi-tri', { params });
  return response.data;
};

export const getLocationById = async (locationId: number): Promise<ApiResponse<Location>> => {
  const response = await api.get<ApiResponse<Location>>(`/vi-tri/${locationId}`);
  return response.data;
};

// Room APIs
export const getRooms = async (params?: SearchParams): Promise<ApiResponse<Room[]>> => {
  const response = await api.get<ApiResponse<Room[]>>('/phong-thue', { params });
  return response.data;
};

export const getRoomById = async (roomId: number): Promise<ApiResponse<Room>> => {
  const response = await api.get<ApiResponse<Room>>(`/phong-thue/${roomId}`);
  return response.data;
};

export const getRoomsByLocationId = async (locationId: number): Promise<ApiResponse<Room[]>> => {
  const response = await api.get<ApiResponse<Room[]>>(`/phong-thue/lay-phong-theo-vi-tri`, {
    params: { maViTri: locationId }
  });
  return response.data;
};

// Rating APIs
export const getRatingsByRoomId = async (roomId: number): Promise<ApiResponse<RatingWithUser[]>> => {
  const response = await api.get<ApiResponse<RatingWithUser[]>>(`/binh-luan/lay-binh-luan-theo-phong/${roomId}`);
  return response.data;
};

export const createRating = async (data: RatingCreate): Promise<ApiResponse<Rating>> => {
  const response = await api.post<ApiResponse<Rating>>('/binh-luan', data);
  return response.data;
};

export const updateRating = async (ratingId: number, data: Partial<RatingCreate>): Promise<ApiResponse<Rating>> => {
  const response = await api.put<ApiResponse<Rating>>(`/binh-luan/${ratingId}`, data);
  return response.data;
};

export const deleteRating = async (ratingId: number): Promise<ApiResponse<string>> => {
  const response = await api.delete<ApiResponse<string>>(`/binh-luan/${ratingId}`);
  return response.data;
};

// Booking APIs
export const getBookingsByUserId = async (userId: number): Promise<ApiResponse<Booking[]>> => {
  const response = await api.get<ApiResponse<Booking[]>>(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
  return response.data;
};

export const createBooking = async (data: BookingCreate): Promise<ApiResponse<Booking>> => {
  const response = await api.post<ApiResponse<Booking>>('/dat-phong', data);
  return response.data;
};

export const deleteBooking = async (bookingId: number): Promise<ApiResponse<string>> => {
  const response = await api.delete<ApiResponse<string>>(`/dat-phong/${bookingId}`);
  return response.data;
};

export default api;
