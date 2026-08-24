<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row items-center justify-center" style="background-color: var(--color-bg-surface)">
        <q-card
          flat
          class="q-pa-lg"
          style="
            width: 420px;
            max-width: 92vw;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            background: var(--color-bg-main);
          "
        >
          <!-- Brand Header -->
          <q-card-section class="text-center q-pb-sm">
            <div
              class="q-mx-auto q-mb-md"
              style="
                width: 56px;
                height: 56px;
                border-radius: var(--radius-md);
                background-color: var(--color-accent);
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              <q-icon name="two_wheeler" size="30px" color="white" />
            </div>
            <div class="text-h5 text-weight-bold" style="color: var(--color-text-main)">
              เข้าสู่ระบบ
            </div>
            <div class="text-caption" style="color: var(--color-text-muted)">
              ระบบจัดการสต็อกอะไหล่มอเตอร์ไซค์
            </div>
          </q-card-section>

          <!-- Login Form -->
          <q-card-section class="q-gutter-md q-pt-md">
            <q-input
              v-model="email"
              outlined
              label="อีเมล / Username"
              dense
            >
              <template #prepend>
                <q-icon name="person" color="grey-5" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              outlined
              type="password"
              label="รหัสผ่าน"
              dense
            >
              <template #prepend>
                <q-icon name="lock" color="grey-5" />
              </template>
            </q-input>

            <q-select
              v-model="selectedRole"
              outlined
              dense
              :options="roleOptions"
              option-label="label"
              option-value="value"
              label="เลือกบทบาททดสอบ (Demo Role)"
              emit-value
              map-options
            >
              <template #prepend>
                <q-icon name="badge" color="grey-5" />
              </template>
            </q-select>

            <q-btn
              color="primary"
              label="เข้าสู่ระบบ"
              class="full-width text-weight-bold q-mt-sm"
              size="md"
              unelevated
              no-caps
              @click="handleLogin"
              style="height: 44px; border-radius: var(--radius-sm)"
            />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, type UserRole } from '@/stores/auth.store';

const email = ref('admin@kistock.com');
const password = ref('123456');
const selectedRole = ref<UserRole>('ADMIN');

const router = useRouter();
const authStore = useAuthStore();

const roleOptions = [
  { label: 'ผู้ดูแลระบบ (Admin)', value: 'ADMIN' },
  { label: 'พนักงานคลังสินค้า (Warehouse)', value: 'WAREHOUSE' },
  { label: 'พนักงานขาย (Sales)', value: 'SALES' },
];

function handleLogin(): void {
  const roleNameMap: Record<UserRole, string> = {
    ADMIN: 'ผู้ดูแลระบบ (Admin)',
    WAREHOUSE: 'พนักงานคลังสินค้า',
    SALES: 'พนักงานขาย',
  };

  authStore.setUser(
    {
      id: 1,
      name: roleNameMap[selectedRole.value],
      email: email.value,
      role: selectedRole.value,
    },
    'mock-token-' + Date.now(),
  );

  void router.push('/');
}
</script>
