<template>
  <q-page class="stock-in-page">
    <div class="container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-icon">
            <q-icon name="input" size="48px" color="primary" />
          </div>
          <div>
            <h1 class="hero-title">บันทึกรับสินค้าเข้า</h1>
            <p class="hero-subtitle">
              นำเข้าสินค้า/อะไหล่เข้าคลัง พร้อมอ้างอิงใบสั่งซื้อ (PO)
            </p>
          </div>
        </div>
        <div class="hero-badge">
          <q-badge color="primary" rounded>FR-3.1</q-badge>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-container">
        <q-card class="form-card" bordered>
          <!-- Header -->
          <q-card-section class="card-header">
            <div class="card-header-content">
              <q-icon name="inventory" size="28px" />
              <div class="card-header-text">
                <h2>ข้อมูลการรับสินค้า</h2>
                <p>กรอกรายละเอียดการรับสินค้าเข้าคลัง</p>
              </div>
            </div>
          </q-card-section>

          <!-- Form Content -->
          <q-card-section class="form-content">
            <div class="form-grid">
              <!-- Product Selection -->
              <div class="form-field full-width">
                <label class="field-label required">เลือกรายการสินค้า</label>
                <q-select
                  v-model="selectedProductId"
                  :options="products"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  outlined
                  :dense="false"
                  placeholder="พิมพ์เพื่อค้นหาสินค้า..."
                  use-input
                  input-debounce="300"
                  class="modern-select"
                  @filter="filterProducts"
                >
                  <template #prepend>
                    <q-icon name="search" color="grey-6" />
                  </template>
                  
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar color="primary" text-color="white" size="40px">
                          <q-icon name="inventory_2" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium">{{ scope.opt.name }}</q-item-label>
                        <q-item-label caption class="text-grey-7">
                          รหัส: {{ scope.opt.partNumber }}
                        </q-item-label>
                        <q-item-label caption>
                          <q-badge :color="scope.opt.stockQty > 10 ? 'positive' : scope.opt.stockQty > 0 ? 'warning' : 'negative'" rounded>
                            คงเหลือ: {{ scope.opt.stockQty }} ชิ้น
                          </q-badge>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>

                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        ไม่พบสินค้าที่ค้นหา
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Quantity Input -->
              <div class="form-field">
                <label class="field-label required">จำนวนที่รับเข้า</label>
                <q-input
                  v-model.number="qty"
                  type="number"
                  outlined
                  min="1"
                  step="1"
                  placeholder="จำนวน (ชิ้น)"
                  class="modern-input"
                >
                  <template #prepend>
                    <q-icon name="add_box" color="positive" />
                  </template>
                  <template #append>
                    <span class="text-grey-7">ชิ้น</span>
                  </template>
                </q-input>
              </div>

              <!-- PO Reference -->
              <div class="form-field">
                <label class="field-label required">เลขที่ใบสั่งซื้อ (PO)</label>
                <q-input
                  v-model="refDocument"
                  outlined
                  placeholder="PO-2026-xxxxx"
                  class="modern-input"
                >
                  <template #prepend>
                    <q-icon name="receipt_long" color="primary" />
                  </template>
                </q-input>
              </div>

              <!-- Notes -->
              <div class="form-field full-width">
                <label class="field-label">หมายเหตุเพิ่มเติม</label>
                <q-input
                  v-model="note"
                  outlined
                  type="textarea"
                  rows="3"
                  placeholder="ระบุรายละเอียดเพิ่มเติม (ถ้ามี)..."
                  class="modern-textarea"
                >
                  <template #prepend>
                    <q-icon name="notes" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <!-- Summary Card (when product selected) -->
              <div v-if="selectedProduct" class="form-field full-width">
                <div class="summary-card">
                  <div class="summary-header">
                    <q-icon name="summarize" color="info" size="24px" />
                    <h3>สรุปการรับสินค้า</h3>
                  </div>
                  <div class="summary-content">
                    <div class="summary-row">
                      <span>สินค้า:</span>
                      <strong>{{ selectedProduct.name }}</strong>
                    </div>
                    <div class="summary-row">
                      <span>รหัสสินค้า:</span>
                      <span>{{ selectedProduct.partNumber }}</span>
                    </div>
                    <div class="summary-row">
                      <span>สต็อกปัจจุบัน:</span>
                      <q-badge :color="selectedProduct.stockQty > 10 ? 'positive' : 'warning'" rounded>
                        {{ selectedProduct.stockQty }} ชิ้น
                      </q-badge>
                    </div>
                    <div v-if="qty > 0" class="summary-row highlight">
                      <span>สต็อกหลังรับเข้า:</span>
                      <q-badge color="positive" rounded>
                        {{ selectedProduct.stockQty + qty }} ชิ้น (+{{ qty }})
                      </q-badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <!-- Actions -->
          <q-card-section class="card-actions">
            <div class="action-buttons">
              <q-btn
                flat
                size="lg"
                color="grey-7"
                icon="close"
                label="ยกเลิก"
                class="action-btn cancel-btn"
                @click="handleCancel"
              />
              <q-btn
                unelevated
                size="lg"
                color="primary"
                icon="save"
                label="บันทึกรับสินค้าเข้า"
                class="action-btn submit-btn"
                :loading="isSubmitting"
                :disable="!canSubmit"
                @click="handleSubmit"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts, type Product } from '@/composables/use-products';
import { useStock } from '@/composables/use-stock';

const router = useRouter();

const { products, loadProducts, updateProduct } = useProducts();
const { recordTransaction } = useStock();

onMounted(async () => {
  try {
    await loadProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
  }
});

// Form state
const selectedProductId = ref<number | null>(null);
const qty = ref<number>(1);
const refDocument = ref<string>(`PO-${new Date().getFullYear()}-`);
const note = ref<string>('');
const isSubmitting = ref<boolean>(false);

// Computed
const selectedProduct = computed((): Product | undefined =>
  products.value.find((p: Product) => p.id === selectedProductId.value)
);

const canSubmit = computed((): boolean => 
  selectedProductId.value !== null && 
  qty.value > 0 && 
  refDocument.value.trim().length > 0
);

// Methods
function filterProducts(val: string, update: (fn: () => void) => void): void {
  update(() => {
    // Filter logic can be enhanced here
    // For now, Quasar handles basic filtering
  });
}

function handleCancel(): void {
  void router.push('/');
}

async function handleSubmit(): Promise<void> {
  if (!canSubmit.value) {
    alert('กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน');
    return;
  }

  const product = selectedProduct.value;
  if (!product) return;

  isSubmitting.value = true;
  
  try {
    // Record stock transaction via API
    await recordTransaction({
      transactionNumber: refDocument.value || `TX-IN-${Date.now()}`,
      transactionType: 'IN',
      productId: product.id,
      quantity: qty.value,
      note: note.value,
    });

    // Update stock level
    await updateProduct(product.id, {
      stockQty: product.stockQty + qty.value,
    });

    // Show success message
    alert(`✅ บันทึกรับสินค้าเข้าเรียบร้อยแล้ว\n${product.name}\n+${qty.value} ชิ้น`);
    
    // Redirect to movements page
    await router.push('/stock/movements');
  } catch (error) {
    console.error('Error submitting stock in:', error);
    alert('❌ เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.stock-in-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hero-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(37, 99, 235, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary, #1e293b);
  line-height: 1.2;
}

.hero-subtitle {
  margin: 0.5rem 0 0 0;
  color: var(--color-text-secondary, #64748b);
  font-size: 1rem;
  line-height: 1.5;
}

.hero-badge {
  flex-shrink: 0;
}

/* Form Container */
.form-container {
  margin-bottom: 2rem;
}

.form-card {
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, var(--color-primary, #2563eb) 0%, #3b82f6 100%);
  color: white;
  padding: 1.5rem 2rem;
}

.card-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-header-text h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-header-text p {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Form Content */
.form-content {
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-weight: 600;
  color: var(--color-text-primary, #1e293b);
  font-size: 0.9rem;
}

.field-label.required::after {
  content: ' *';
  color: #ef4444;
}

/* Modern Inputs */
.modern-select,
.modern-input,
.modern-textarea {
  font-size: 1rem;
}

.modern-select :deep(.q-field__control) {
  height: 56px;
  border-radius: 12px;
}

.modern-input :deep(.q-field__control),
.modern-textarea :deep(.q-field__control) {
  border-radius: 12px;
}

/* Summary Card */
.summary-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.summary-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary, #1e293b);
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-row.highlight {
  background: rgba(34, 197, 94, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
}

.summary-row span:first-child {
  color: var(--color-text-secondary, #64748b);
  font-size: 0.9rem;
}

/* Actions */
.card-actions {
  background: #f8fafc;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.action-btn {
  min-width: 140px;
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.cancel-btn {
  color: #64748b;
}

.submit-btn {
  background: linear-gradient(135deg, var(--color-primary, #2563eb) 0%, #3b82f6 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-content {
    padding: 1.5rem;
  }

  .card-actions {
    padding: 1.5rem;
  }

  .action-buttons {
    flex-direction: column-reverse;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .stock-in-page {
    padding: 0.5rem;
  }
  
  .hero-section {
    padding: 1rem;
  }
  
  .form-content {
    padding: 1rem;
  }
}
</style>
