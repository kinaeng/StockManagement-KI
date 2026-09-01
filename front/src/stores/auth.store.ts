import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { login as loginRequest, type LoginRequest } from '@/services/auth.service';

export type UserRole = 'ADMIN';

export interface User {
  id: number;
  username?: string;
  name: string;
  email: string;
  role: UserRole;
}

const TOKEN_STORAGE_KEY = 'ki-stock.access-token';
const USER_STORAGE_KEY = 'ki-stock.current-user';

function getStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function readStoredUser(): User | null {
  const storage = getStorage();
  const storedUser = storage?.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    storage?.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const storage = getStorage();
  const token = ref<string | null>(storage?.getItem(TOKEN_STORAGE_KEY) ?? null);
  const currentUser = ref<User | null>(readStoredUser());
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!currentUser.value && !!token.value);
  const isAdmin = computed(() => currentUser.value?.role === 'ADMIN');

  const roleLabel = computed(() => {
    switch (currentUser.value?.role) {
      case 'ADMIN':
        return 'ผู้ดูแลระบบ';
      default:
        return 'ผู้ใช้งาน';
    }
  });

  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true;

    try {
      const response = await loginRequest(credentials);
      const user: User = {
        id: response.user.id,
        name: response.user.fullName ?? response.user.name ?? response.user.email,
        email: response.user.email,
        role: response.user.role,
        ...(response.user.username !== undefined
          ? { username: response.user.username }
          : {}),
      };

      token.value = response.accessToken;
      currentUser.value = user;
      storage?.setItem(TOKEN_STORAGE_KEY, response.accessToken);
      storage?.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } finally {
      isLoading.value = false;
    }
  }

  function logout(): void {
    token.value = null;
    currentUser.value = null;
    storage?.removeItem(TOKEN_STORAGE_KEY);
    storage?.removeItem(USER_STORAGE_KEY);
  }

  return {
    currentUser,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    roleLabel,
    login,
    logout,
  };
});
