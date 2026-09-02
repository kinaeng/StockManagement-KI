import { apiRequest } from './api-client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUserResponse {
  id: number;
  username?: string;
  email: string;
  fullName?: string;
  name?: string;
  role: 'ADMIN';
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUserResponse;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: request,
    auth: false,
  });
}
