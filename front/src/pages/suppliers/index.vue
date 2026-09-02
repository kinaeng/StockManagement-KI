<template>
  <q-page class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h4 text-weight-bold text-primary q-my-none">จัดการข้อมูลผู้จำหน่าย (Suppliers)</h1>
        <p class="text-subtitle2 text-grey-7 q-mb-none">
          บันทึกและจัดการรายชื่อผู้จัดจำหน่ายอะไหล่ (FR-5.1)
        </p>
      </div>
      <q-btn color="primary" icon="add" label="เพิ่มผู้จำหน่าย" @click="isModalOpen = true" />
    </div>

    <BaseTable
      title="รายชื่อผู้จำหน่ายทั้งหมด"
      :rows="suppliers"
      :columns="columns"
      :loading="isLoading"
    />

    <BaseModal
      v-model="isModalOpen"
      title="เพิ่มผู้จำหน่ายรายใหม่"
      confirm-label="บันทึก"
      :loading="isLoading"
      @confirm="saveSupplier"
    >
      <div class="q-gutter-md">
        <q-input v-model="form.code" outlined dense label="รหัสผู้จำหน่าย (เช่น SUP-004)" :rules="[(val) => !!val || 'กรุณากรอกรหัสผู้จำหน่าย']" />
        <q-input v-model="form.name" outlined dense label="ชื่อบริษัท / ร้านค้า" :rules="[(val) => !!val || 'กรุณากรอกชื่อผู้จำหน่าย']" />
        <q-input v-model="form.contactPerson" outlined dense label="ชื่อผู้ติดต่อ" />
        <q-input v-model="form.phone" outlined dense label="เบอร์โทรศัพท์" />
        <q-input v-model="form.email" outlined dense label="อีเมล" />
      </div>
    </BaseModal>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import BaseTable from '@/components/base/BaseTable.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import { useSuppliers, type Supplier } from '@/composables/use-suppliers';

const $q = useQuasar();
const { suppliers, isLoading, loadSuppliers, addSupplier } = useSuppliers();

const columns = [
  { name: 'code', label: 'รหัส', field: 'code', align: 'left' as const, sortable: true },
  { name: 'name', label: 'ชื่อผู้จำหน่าย', field: 'name', align: 'left' as const, sortable: true },
  { name: 'contactPerson', label: 'ผู้ติดต่อ', field: 'contactPerson', align: 'left' as const },
  { name: 'phone', label: 'เบอร์โทรศัพท์', field: 'phone', align: 'left' as const },
  { name: 'email', label: 'อีเมล', field: 'email', align: 'left' as const },
];

const isModalOpen = ref(false);
const form = reactive<Omit<Supplier, 'id'>>({
  code: '',
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
});

onMounted(async () => {
  try {
    await loadSuppliers();
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'โหลดข้อมูลผู้จำหน่ายไม่สำเร็จ',
    });
  }
});

async function saveSupplier(): Promise<void> {
  if (!form.code || !form.name) return;

  try {
    await addSupplier({ ...form });
    $q.notify({
      type: 'positive',
      message: 'เพิ่มผู้จำหน่ายเรียบร้อยแล้ว',
    });
    isModalOpen.value = false;
    form.code = '';
    form.name = '';
    form.contactPerson = '';
    form.phone = '';
    form.email = '';
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err instanceof Error ? err.message : 'บันทึกผู้จำหน่ายไม่สำเร็จ',
    });
  }
}
</script>
