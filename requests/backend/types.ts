/**
 * Backend API types
 */

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

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  userType: 'admin' | 'seller' | 'buyer';
  status: 'active' | 'inactive' | 'pending_verification' | 'suspended';
  emailVerified: boolean;
  profileComplete: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
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
