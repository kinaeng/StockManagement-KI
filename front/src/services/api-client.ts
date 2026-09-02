export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

interface ApiErrorResponse {
  success?: false;
  statusCode?: number;
  message?: string | string[];
  timestamp?: string;
  path?: string;
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
const TOKEN_STORAGE_KEY = 'ki-stock.access-token';
const USER_STORAGE_KEY = 'ki-stock.current-user';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

function clearAuthState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  if (window.location.hash.includes('/login')) return;

  const redirect = encodeURIComponent(`${window.location.hash.replace(/^#/, '') || '/'}`);
  window.location.hash = `/login?redirect=${redirect}`;
}

function normalizeMessage(message: ApiErrorResponse['message'], fallback: string): string {
  if (Array.isArray(message)) return message.join(', ');
  return message || fallback;
}

async function readJsonBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const fetchOptions: RequestInit = {
    ...requestOptions,
    headers: requestHeaders,
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions);
  const responseBody = await readJsonBody(response);

  if (!response.ok) {
    const errorBody = responseBody as ApiErrorResponse | undefined;
    const message = normalizeMessage(errorBody?.message, 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');

    if (response.status === 401) {
      clearAuthState();
      redirectToLogin();
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const apiBody = responseBody as ApiResponse<T> | T;
  if (apiBody && typeof apiBody === 'object' && 'data' in apiBody) {
    return apiBody.data;
  }
  return apiBody;
}
