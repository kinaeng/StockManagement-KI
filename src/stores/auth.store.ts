import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UserRole = 'ADMIN' | 'WAREHOUSE' | 'SALES';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>({
    id: 1,
    name: 'ผู้ดูแลระบบ (Admin)',
    email: 'admin@kistock.com',
    role: 'ADMIN',
  });

  const token = ref<string | null>('mock-jwt-token-123456');

  // Computed
  const isAuthenticated = computed((): boolean => !!currentUser.value && !!token.value);

  const isAdmin = computed((): boolean => currentUser.value?.role === 'ADMIN');

  const isWarehouse = computed(
    (): boolean => currentUser.value?.role === 'ADMIN' || currentUser.value?.role === 'WAREHOUSE',
  );

  const isSales = computed(
    (): boolean => currentUser.value?.role === 'ADMIN' || currentUser.value?.role === 'SALES',
  );

  const roleLabel = computed((): string => {
    switch (currentUser.value?.role) {
      case 'ADMIN':
        return 'ผู้ดูแลระบบ';
      case 'WAREHOUSE':
        return 'พนักงานคลังสินค้า';
      case 'SALES':
        return 'พนักงานขาย';
      default:
        return 'ผู้ใช้งาน';
    }
  });

  // Actions
  const setUser = (user: User | null, userToken: string | null): void => {
    currentUser.value = user;
    token.value = userToken;
  };

  const logout = (): void => {
    currentUser.value = null;
    token.value = null;
  };

  return {
    currentUser,
    token,
    isAuthenticated,
    isAdmin,
    isWarehouse,
    isSales,
    roleLabel,
    setUser,
    logout,
  };
});
