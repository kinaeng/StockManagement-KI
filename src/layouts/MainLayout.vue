<template>
  <q-layout view="lHh Lpr lFf">
    <!-- ============================================ -->
    <!-- Header: White minimal bar                    -->
    <!-- ============================================ -->
    <q-header class="app-header" :elevated="false">
      <q-toolbar style="min-height: 52px">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
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
          <div class="app-header__user-chip row items-center q-px-sm q-py-xs" style="border-radius: 20px">
            <q-icon name="account_circle" size="18px" class="q-mr-xs" />
            <span>{{ authStore.currentUser?.name || 'ผู้ใช้งาน' }}</span>
            <q-badge
              :label="authStore.roleLabel"
              color="primary"
              text-color="white"
              class="q-ml-xs"
              style="font-size: 0.65rem; padding: 2px 6px"
            />
          </div>
          <q-btn flat round icon="logout" size="sm" color="grey-6" @click="handleLogout">
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
          <div class="sidebar-brand__sub">จัดการสต็อกอะไหล่</div>
        </div>
      </div>

      <q-list padding>
        <!-- ── ภาพรวม ── -->
        <div class="sidebar-section-label">ภาพรวม</div>

        <q-item
          clickable
          v-ripple
          to="/"
          exact
          :class="['sidebar-item', isActive('/') && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section><q-item-label>แดชบอร์ด</q-item-label></q-item-section>
        </q-item>

        <q-separator class="sidebar-divider" />

        <!-- ── จัดการข้อมูล ── -->
        <div class="sidebar-section-label">จัดการข้อมูล</div>

        <q-item
          clickable
          v-ripple
          to="/products/"
          :class="['sidebar-item', (isActive('/products') || isActive('/products/')) && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="inventory_2" /></q-item-section>
          <q-item-section><q-item-label>รายการอะไหล่</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/vehicles/compatibility"
          :class="['sidebar-item', isActive('/vehicles/compatibility') && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="link" /></q-item-section>
          <q-item-section><q-item-label>ความเข้ากันได้ของรุ่นรถ</q-item-label></q-item-section>
        </q-item>

        <q-separator class="sidebar-divider" />

        <!-- ── สต็อกสินค้า ── -->
        <div class="sidebar-section-label">สต็อกสินค้า</div>

        <q-item
          clickable
          v-ripple
          to="/stock/in"
          :class="['sidebar-item', isActive('/stock/in') && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="input" /></q-item-section>
          <q-item-section><q-item-label>รับสินค้าเข้า</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/stock/out"
          :class="['sidebar-item', isActive('/stock/out') && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="output" /></q-item-section>
          <q-item-section><q-item-label>จ่ายสินค้าออก</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/stock/adjust"
          :class="['sidebar-item', isActive('/stock/adjust') && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="edit_note" /></q-item-section>
          <q-item-section><q-item-label>ปรับปรุงสต็อก</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/stock/alerts"
          :class="['sidebar-item', isActive('/stock/alerts') && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="warning" color="warning" /></q-item-section>
          <q-item-section><q-item-label>แจ้งเตือนสต็อกต่ำ</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/stock/movements"
          :class="['sidebar-item', isActive('/stock/movements') && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="history" /></q-item-section>
          <q-item-section><q-item-label>ประวัติการเคลื่อนไหว</q-item-label></q-item-section>
        </q-item>

        <q-separator class="sidebar-divider" />

        <!-- ── จัดซื้อ ── -->
        <div class="sidebar-section-label">จัดซื้อ</div>

        <q-item
          clickable
          v-ripple
          to="/suppliers/"
          :class="['sidebar-item', (isActive('/suppliers') || isActive('/suppliers/')) && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section><q-item-label>ผู้จำหน่าย</q-item-label></q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/purchase-orders/"
          :class="['sidebar-item', (isActive('/purchase-orders') || isActive('/purchase-orders/')) && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="receipt_long" /></q-item-section>
          <q-item-section><q-item-label>ใบสั่งซื้อ (PO)</q-item-label></q-item-section>
        </q-item>

        <q-separator class="sidebar-divider" />

        <!-- ── รายงาน & ระบบ ── -->
        <div class="sidebar-section-label">รายงาน & ระบบ</div>

        <q-item
          clickable
          v-ripple
          to="/reports/"
          :class="['sidebar-item', (isActive('/reports') || isActive('/reports/')) && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="assessment" /></q-item-section>
          <q-item-section><q-item-label>รายงาน</q-item-label></q-item-section>
        </q-item>

        <q-item
          v-if="authStore.isAdmin"
          clickable
          v-ripple
          to="/users/"
          :class="['sidebar-item', (isActive('/users') || isActive('/users/')) && 'sidebar-item--active']"
        >
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section><q-item-label>ผู้ใช้งานระบบ</q-item-label></q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- ============================================ -->
    <!-- Page Container                               -->
    <!-- ============================================ -->
    <q-page-container class="app-page-content">
      <slot />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const leftDrawerOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

function toggleLeftDrawer(): void {
  leftDrawerOpen.value = !leftDrawerOpen.value;
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
