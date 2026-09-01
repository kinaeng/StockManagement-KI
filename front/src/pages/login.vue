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

          <q-form class="q-card__section q-gutter-md q-pt-md" @submit.prevent="handleLogin">
            <q-input
              v-model="identifier"
              outlined
              label="อีเมล / Username"
              dense
              autocomplete="username"
              :disable="authStore.isLoading"
              :rules="[(value) => !!value || 'กรุณากรอกอีเมลหรือ Username']"
            >
              <template #prepend>
                <q-icon name="person" color="grey-5" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              outlined
              :type="showPassword ? 'text' : 'password'"
              label="รหัสผ่าน"
              dense
              autocomplete="current-password"
              :disable="authStore.isLoading"
              :rules="[(value) => !!value || 'กรุณากรอกรหัสผ่าน']"
            >
              <template #prepend>
                <q-icon name="lock" color="grey-5" />
              </template>
              <template #append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showPassword ? 'visibility_off' : 'visibility'"
                  :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                  :disable="authStore.isLoading"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-btn
              type="submit"
              color="primary"
              label="เข้าสู่ระบบ"
              class="full-width text-weight-bold q-mt-sm"
              size="md"
              unelevated
              no-caps
              :loading="authStore.isLoading"
              :disable="!identifier.trim() || !password"
              style="height: 44px; border-radius: var(--radius-sm)"
            />
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const identifier = ref('');
const password = ref('');
const showPassword = ref(false);

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

async function handleLogin(): Promise<void> {
  try {
    await authStore.login({
      username: identifier.value.trim(),
      password: password.value,
    });

    const redirect = typeof router.currentRoute.value.query.redirect === 'string'
      ? router.currentRoute.value.query.redirect
      : '/';

    await router.replace(redirect);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error instanceof Error ? error.message : 'เข้าสู่ระบบไม่สำเร็จ',
    });
  }
}
</script>
