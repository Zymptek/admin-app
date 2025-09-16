/**
 * Backend API types
 */

// Common types
export type UserType = 'buyer' | 'seller' | 'admin';
export type UserStatus =
  | 'active'
  | 'inactive'
  | 'pending_verification'
  | 'suspended';

// Auth types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  admin: AdminUser;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  country?: string;
  userType: UserType;
  status: UserStatus;
  emailVerified: boolean;
  profileComplete: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser extends User {
  firstName: string;
  lastName: string;
  companyName: string;
  userType: 'admin';
}

// User management request/response types
export interface CreateUserRequest {
  email: string;
  password: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  country?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  country?: string;
  userType?: UserType;
}

export interface SuspendUserRequest {
  reason?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  userType?: UserType;
  status?: UserStatus;
  search?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserResponse {
  message: string;
  data: User;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  activeUsers: number;
  pendingUsers: number;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface DashboardResponse {
  message: string;
  data: DashboardStats;
}

export interface ProfileResponse {
  message: string;
  data: AdminUser;
}
