// API Response Types
export interface ApiResponse<T> {
  statusCode: number;
  content: T;
  dateTime: string;
  message: string;
  messageCode: number;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Location Types
export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

// Room Types
export interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  moTaVitri?: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maViTri: number;
  hinhAnh: string;
}

export interface RoomDetail extends Room {
  locationDetail?: Location;
}

// Rating Types
export interface Rating {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
}

export interface RatingCreate {
  maPhong: number;
  noiDung: string;
  saoBinhLuan: number;
}

export interface RatingWithUser extends Rating {
  tenNguoiBinhLuan: string;
  avatar: string;
}

// Booking Types
export interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface BookingCreate {
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

// Search params
export interface SearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
}