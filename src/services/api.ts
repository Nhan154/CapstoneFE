import axios from 'axios';
import { ApiResponse, AuthResponse, Booking, BookingCreate, Location, Room, SearchParams, User, UserLogin, UserRegister } from '@/types';

const API_URL = 'https://airbnbnew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MSIsIkhldEhhblN0cmluZyI6IjI4LzExLzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc2NDI4ODAwMDAwMCIsIm5iZiI6MTczNTM0NDAwMCwiZXhwIjoxNzY0NDYwODAwfQ.Vl0ntLG6G7ajYZQonTAwyAmHVk9GLbkXalVz4BbqmLk';

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