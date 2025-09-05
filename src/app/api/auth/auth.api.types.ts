export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    roles: string[];
    isActive: boolean;
    isEmailVerified: boolean;
    lastLoginAt: string;
  };
}

export interface AuthResponseLogout{
	message: string,
	timestamp: number
}

export interface RefreshTokenRequest {
  refreshToken: string;
  accessToken: string;
}