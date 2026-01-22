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
// src/services/api.ts
api.interceptors.request.use((config) => {
  // Lấy token từ localStorage (kiểm tra lại tên key là 'token' hay 'accessToken')
  const token = localStorage.getItem('token'); 
  
  if (token) {
    // Lưu ý: Phải có chữ 'Bearer ' phía trước token
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Header này bắt buộc cho các dự án của Cybersoft
  config.headers['tokenByClass'] = TOKEN_CYBERSOFT; 
  
  return config;
});

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



// --- ADMIN APIs ---

// Hàm thống kê giả lập (Nếu backend chưa có)
export const getDashboardStats = async () => {
  // Giả lập delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalUsers: 1250,
    totalRooms: 340,
    totalBookings: 890,
    revenue: 450000000 // VND
  };
};

// --- API User Management ---

// 1. Lấy danh sách user (Dùng endpoint phân trang để luôn có đủ SĐT)
export const getUsers = async (pageIndex = 1, pageSize = 10, keyword = ''): Promise<ApiResponse<any>> => {
  // Xây dựng URL: Nếu có keyword thì thêm vào, không thì chỉ phân trang
  let url = `/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}`;
  if (keyword) {
    url += `&keyword=${keyword}`;
  }
  
  const response = await api.get<ApiResponse<any>>(url);
  return response.data;
};

// 2. Tạo user mới
export const createUser = async (userData: any): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/users', userData);
  return response.data;
};

// 3. Cập nhật user
export const updateUser = async (id: number, userData: any): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
  return response.data;
};

// 4. Xóa user
export const deleteUser = async (id: number): Promise<ApiResponse<string>> => {
  const response = await api.delete<ApiResponse<string>>(`/users`, {
    params: { id }
  });
  return response.data;
};

// --- THÊM VÀO PHẦN Room APIs TRONG FILE api.ts ---

export const deleteRoom = async (roomId: number): Promise<ApiResponse<string>> => {
  const response = await api.delete<ApiResponse<string>>(`/phong-thue/${roomId}`);
  return response.data;
};

// Thêm vào src/services/api.ts
export const createRoom = async (data: any): Promise<ApiResponse<Room>> => {
  const response = await api.post<ApiResponse<Room>>('/phong-thue', data);
  return response.data;
};

export const updateRoom = async (id: number, data: any): Promise<ApiResponse<Room>> => {
  const response = await api.put<ApiResponse<Room>>(`/phong-thue/${id}`, data);
  return response.data;
};

export const uploadRoomImage = async (roomId: number, file: File): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append('formFile', file);
  const response = await api.post<ApiResponse<any>>(`/phong-thue/upload-hinh-phong?maPhong=${roomId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
export default api;
