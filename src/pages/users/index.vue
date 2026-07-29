<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between page-header">
      <div>
        <h1 class="page-header__title">จัดการผู้ใช้งานและสิทธิ์ (User Management)</h1>
        <p class="page-header__subtitle">
          จัดการบัญชีผู้ใช้งาน กำหนดบทบาทสิทธิ์การเข้าถึง และตรวจสอบประวัติการใช้งาน (FR-7.1, FR-7.2, FR-7.3)
        </p>
      </div>
      <q-btn
        color="primary"
        icon="person_add"
        label="เพิ่มผู้ใช้งาน"
        no-caps
        unelevated
        @click="isModalOpen = true"
      />
    </div>

    <!-- User List Table -->
    <BaseTable
      title="รายชื่อผู้ใช้งานระบบ"
      :rows="users"
      :columns="columns"
      class="q-mb-lg"
    >
      <template #body-cell-role="props">
        <q-td :props="props">
          <q-chip :color="getRoleColor(props.row.role)" text-color="white" size="sm">
            {{ getRoleLabel(props.row.role) }}
          </q-chip>
        </q-td>
      </template>
    </BaseTable>

    <!-- Audit Trail Log Table (FR-7.3) -->
    <BaseTable
      title="ประวัติการเข้าใช้งานและทำรายการ (Audit Trail Log)"
      :rows="auditTrailLogs"
      :columns="auditColumns"
    >
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-chip
            :color="getActionColor(props.row.action)"
            text-color="white"
            size="xs"
            dense
          >
            {{ props.row.action }}
          </q-chip>
        </q-td>
      </template>
    </BaseTable>

    <!-- Add User Modal -->
    <BaseModal
      v-model="isModalOpen"
      title="เพิ่มผู้ใช้งานระบบใหม่"
      confirm-label="บันทึก"
      @confirm="saveUser"
    >
      <div class="q-gutter-md">
        <q-input v-model="form.name" outlined dense label="ชื่อ-นามสกุล *" />
        <q-input v-model="form.email" outlined dense label="อีเมล *" />
        <q-select
          v-model="form.role"
          outlined
          dense
          :options="roleOptions"
          option-label="label"
          option-value="value"
          label="บทบาท / สิทธิ์การใช้งาน *"
          emit-value
          map-options
        />
      </div>
    </BaseModal>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import type { UserRole, User } from '@/stores/auth.store';

interface AuditLog {
  id: number;
  timestamp: string;
  userName: string;
  role: string;
  action: string;
  detail: string;
  ipAddress: string;
}

const users = ref<User[]>([
  { id: 1, name: 'สมศักดิ์ ผู้ดูแลระบบ', email: 'admin@kistock.com', role: 'ADMIN' },
  { id: 2, name: 'วิชัย พนักงานคลัง', email: 'warehouse@kistock.com', role: 'WAREHOUSE' },
  { id: 3, name: 'มณีรัตน์ พนักงานขาย', email: 'sales@kistock.com', role: 'SALES' },
]);

const auditTrailLogs = ref<AuditLog[]>([
  { id: 1, timestamp: '2026-07-29 09:10', userName: 'สมศักดิ์ ผู้ดูแลระบบ', role: 'ADMIN', action: 'LOGIN', detail: 'เข้าสู่ระบบสำเร็จ', ipAddress: '192.168.1.45' },
  { id: 2, timestamp: '2026-07-29 08:45', userName: 'วิชัย พนักงานคลัง', role: 'WAREHOUSE', action: 'STOCK_IN', detail: 'บันทึกรับสินค้า HON-14401 (+50)', ipAddress: '192.168.1.12' },
  { id: 3, timestamp: '2026-07-29 08:30', userName: 'มณีรัตน์ พนักงานขาย', role: 'SALES', action: 'STOCK_OUT', detail: 'ตัดสต็อกขาย SO-2026-089 (-48)', ipAddress: '192.168.1.18' },
  { id: 4, timestamp: '2026-07-28 17:00', userName: 'สมศักดิ์ ผู้ดูแลระบบ', role: 'ADMIN', action: 'USER_ADD', detail: 'เพิ่มผู้ใช้งาน มณีรัตน์ พนักงานขาย', ipAddress: '192.168.1.45' },
]);

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const },
  { name: 'name', label: 'ชื่อ-นามสกุล', field: 'name', align: 'left' as const, sortable: true },
  { name: 'email', label: 'อีเมล', field: 'email', align: 'left' as const },
  { name: 'role', label: 'บทบาท (Role)', field: 'role', align: 'center' as const },
];

const auditColumns = [
  { name: 'timestamp', label: 'วันที่/เวลา', field: 'timestamp', align: 'left' as const, sortable: true },
  { name: 'userName', label: 'ผู้ใช้งาน', field: 'userName', align: 'left' as const },
  { name: 'action', label: 'การกระทำ', field: 'action', align: 'center' as const },
  { name: 'detail', label: 'รายละเอียด', field: 'detail', align: 'left' as const },
  { name: 'ipAddress', label: 'IP Address', field: 'ipAddress', align: 'left' as const },
];

const roleOptions = [
  { label: 'ผู้ดูแลระบบ (Admin)', value: 'ADMIN' },
  { label: 'พนักงานคลังสินค้า (Warehouse)', value: 'WAREHOUSE' },
  { label: 'พนักงานขาย (Sales)', value: 'SALES' },
];

const isModalOpen = ref(false);
const form = reactive<Omit<User, 'id'>>({
  name: '',
  email: '',
  role: 'WAREHOUSE',
});

function getRoleColor(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return 'purple';
    case 'WAREHOUSE':
      return 'blue';
    case 'SALES':
      return 'teal';
    default:
      return 'grey';
  }
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return 'ผู้ดูแลระบบ (Admin)';
    case 'WAREHOUSE':
      return 'พนักงานคลังสินค้า';
    case 'SALES':
      return 'พนักงานขาย';
    default:
      return 'ผู้ใช้งาน';
  }
}

function getActionColor(action: string): string {
  switch (action) {
    case 'LOGIN':
      return 'info';
    case 'STOCK_IN':
      return 'positive';
    case 'STOCK_OUT':
      return 'negative';
    case 'USER_ADD':
      return 'purple';
    default:
      return 'grey';
  }
}

function saveUser(): void {
  if (!form.name || !form.email) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }
  const id = users.value.length + 1;
  users.value.push({ ...form, id });
  isModalOpen.value = false;
  form.name = '';
  form.email = '';
  form.role = 'WAREHOUSE';
}
</script>
