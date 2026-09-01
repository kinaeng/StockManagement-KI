<template>
  <q-layout view="lHh Lpr lFf">
    <!-- ============================================ -->
    <!-- Header: White minimal bar                    -->
    <!-- ============================================ -->
    <q-header class="app-header" :elevated="false">
      <q-toolbar class="app-header__toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="เปิดเมนูนำทาง"
          class="app-header__icon"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="two_wheeler" size="22px" class="q-mr-sm app-header__icon" />
          <span class="app-header__title">ระบบจัดการสต็อกอะไหล่มอเตอร์ไซค์</span>
        </q-toolbar-title>

        <q-space />

        <!-- User Info & Logout -->
        <div class="row items-center q-gutter-sm">
          <div
            class="app-header__user-chip row items-center q-px-sm q-py-xs"
          >
            <q-icon name="account_circle" size="18px" class="q-mr-xs" />
            <span>{{ authStore.currentUser?.name || 'ผู้ใช้งาน' }}</span>
            <q-badge
              :label="authStore.roleLabel"
              color="primary"
              text-color="white"
              class="q-ml-xs app-header__role-badge"
            />
          </div>
          <q-btn
            flat
            round
            icon="logout"
            size="sm"
            class="app-header__logout"
            aria-label="ออกจากระบบ"
            @click="handleLogout"
          >
            <q-tooltip>ออกจากระบบ</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- ============================================ -->
    <!-- Sidebar: Clean white with grouped menus      -->
    <!-- ============================================ -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="260"
      :breakpoint="1024"
      class="app-sidebar"
      :bordered="false"
    >
      <!-- Brand -->
      <div class="sidebar-brand row items-center q-gutter-sm no-wrap">
        <div class="sidebar-brand__icon">
          <q-icon name="two_wheeler" size="20px" />
        </div>
        <div>
          <div class="sidebar-brand__text">KI Stock</div>
          <div class="sidebar-brand__sub">ติดตามสต็อก & ประวัติการสั่งซื้อ</div>
        </div>
      </div>

      <q-list padding aria-label="เมนูหลัก">
        <!-- ── ภาพรวม ── -->
        <div class="sidebar-section-label">ภาพรวม</div>

        <q-item
          clickable
          v-ripple
          to="/"
          exact
          :aria-current="isActive('/') ? 'page' : undefined"
          :class="['sidebar-item', isActive('/') && 'sidebar-item--active']"
          @click="closeDrawerOnMobile"
        >
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section><q-item-label>แดชบอร์ด</q-item-label></q-item-section>
        </q-item>

        <q-separator class="sidebar-divider" />

        <!-- ── ติดตามสต็อก ── -->
        <div class="sidebar-section-label">ติดตามสต็อก (Stock Tracking)</div>

        <q-item
          clickable
          v-ripple
          to="/products/"
          :aria-current="isActive('/products') || isActive('/products/') ? 'page' : undefined"
          :class="[
            'sidebar-item',
            (isActive('/products') || isActive('/products/')) && 'sidebar-item--active',
          ]"
          @click="closeDrawerOnMobile"
        >
          <q-item-section avatar><q-icon name="inventory_2" /></q-item-section>
          <q-item-section><q-item-label>สินค้า & สต็อกคงเหลือ</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/stock/movements"
          :aria-current="isActive('/stock/movements') ? 'page' : undefined"
          :class="['sidebar-item', isActive('/stock/movements') && 'sidebar-item--active']"
          @click="closeDrawerOnMobile"
        >
          <q-item-section avatar><q-icon name="history" /></q-item-section>
          <q-item-section><q-item-label>ประวัติการเคลื่อนไหว</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/stock/alerts"
          :aria-current="isActive('/stock/alerts') ? 'page' : undefined"
          :class="['sidebar-item', isActive('/stock/alerts') && 'sidebar-item--active']"
          @click="closeDrawerOnMobile"
        >
          <q-item-section avatar><q-icon name="warning" color="warning" /></q-item-section>
          <q-item-section><q-item-label>แจ้งเตือนสต็อกต่ำ</q-item-label></q-item-section>
        </q-item>

        <q-separator class="sidebar-divider" />

        <!-- ── ประวัติการสั่งซื้อ ── -->
        <div class="sidebar-section-label">ประวัติการสั่งซื้อ (Purchase Orders)</div>

        <q-item
          clickable
          v-ripple
          to="/purchase-orders/"
          :aria-current="isActive('/purchase-orders') || isActive('/purchase-orders/') ? 'page' : undefined"
          :class="[
            'sidebar-item',
            (isActive('/purchase-orders') || isActive('/purchase-orders/')) &&
              'sidebar-item--active',
          ]"
          @click="closeDrawerOnMobile"
        >
          <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
          <q-item-section><q-item-label>ประวัติใบสั่งซื้อ (PO)</q-item-label></q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- ============================================ -->
    <!-- Page Container                               -->
    <!-- ============================================ -->
    <q-page-container class="app-page-content">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

function toggleLeftDrawer(): void {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function closeDrawerOnMobile(): void {
  if ($q.screen.lt.md) leftDrawerOpen.value = false;
}

function handleLogout(): void {
  authStore.logout();
  void router.push('/login');
}

/** Check exact route match */
function isActive(path: string): boolean {
  return route.path === path;
}
</script>
