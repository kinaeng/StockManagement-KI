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

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let message = 'เข้าสู่ระบบไม่สำเร็จ';

    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        message = body.message.join(', ');
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      // Keep the generic message when the server does not return JSON.
    }

    throw new Error(message);
  }

  const body = (await response.json()) as Partial<ApiResponse<LoginResponse>> & Partial<LoginResponse>;
  const loginData = body.data ?? body;

  if (!loginData.accessToken || !loginData.user) {
    throw new Error('รูปแบบข้อมูลจากเซิร์ฟเวอร์ไม่ถูกต้อง');
  }

  return {
    accessToken: loginData.accessToken,
    user: loginData.user,
  };
}
