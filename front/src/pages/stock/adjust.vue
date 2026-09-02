<template>
  <q-page class="stock-adjust-page">
    <div class="container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-icon">
            <q-icon name="edit_note" size="48px" color="warning" />
          </div>
          <div>
            <h1 class="hero-title">ปรับปรุงจำนวนสต็อก</h1>
            <p class="hero-subtitle">
              บันทึกการปรับปรุงสต็อกกรณีสินค้าชำรุด สูญหาย หรือนับสต็อกจริง
            </p>
          </div>
        </div>
        <div class="hero-badge">
          <q-badge color="warning" rounded>FR-3.3</q-badge>
        </div>
      </div>

      <!-- Form Card -->
      <div class="form-container">
        <q-card class="form-card" bordered>
          <!-- Header -->
          <q-card-section class="card-header adjust-header">
            <div class="card-header-content">
              <q-icon name="inventory" size="28px" />
              <div class="card-header-text">
                <h2>ข้อมูลการปรับปรุงสต็อก</h2>
                <p>บันทึกการเปลี่ยนแปลงจำนวนสต็อกสินค้า</p>
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
                        <q-avatar color="warning" text-color="white" size="40px">
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

              <!-- Current Stock Display -->
              <div v-if="selectedProduct" class="form-field full-width">
                <div class="current-stock-card">
                  <div class="current-stock-header">
                    <q-icon name="info" color="info" size="24px" />
                    <h3>สต็อกปัจจุบัน</h3>
                  </div>
                  <div class="current-stock-content">
                    <div class="stock-info">
                      <span class="product-name">{{ selectedProduct.name }}</span>
                      <div class="stock-amount">
                        <q-badge :color="selectedProduct.stockQty > 10 ? 'positive' : 'warning'" size="lg" rounded>
                          {{ selectedProduct.stockQty }} ชิ้น
                        </q-badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Adjustment Reason -->
              <div class="form-field">
                <label class="field-label required">เหตุผลในการปรับ</label>
                <q-select
                  v-model="adjustReason"
                  :options="reasonOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  outlined
                  placeholder="เลือกเหตุผล..."
                  class="modern-select"
                >
                  <template #prepend>
                    <q-icon name="help" color="warning" />
                  </template>
                </q-select>
              </div>

              <!-- New Stock Quantity -->
              <div class="form-field">
                <label class="field-label required">จำนวนสต็อกใหม่ (หลังปรับ)</label>
                <q-input
                  v-model.number="newQty"
                  type="number"
                  outlined
                  min="0"
                  step="1"
                  placeholder="จำนวนใหม่ (ชิ้น)"
                  class="modern-input"
                >
                  <template #prepend>
                    <q-icon name="edit" color="warning" />
                  </template>
                  <template #append>
                    <span class="text-grey-7">ชิ้น</span>
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
                  placeholder="ระบุรายละเอียดเพิ่มเติม เช่น สาเหตุที่ชำรุด, สถานที่พบ..."
                  class="modern-textarea"
                >
                  <template #prepend>
                    <q-icon name="notes" color="grey-6" />
                  </template>
                </q-input>
              </div>

              <!-- Adjustment Preview -->
              <div v-if="selectedProduct && newQty !== null && newQty !== selectedProduct.stockQty" class="form-field full-width">
                <div class="adjustment-preview">
                  <div class="preview-header">
                    <q-icon name="compare_arrows" color="warning" size="24px" />
                    <h3>ผลการเปลี่ยนแปลง</h3>
                  </div>
                  <div class="preview-content">
                    <div class="change-summary">
                      <div class="change-row">
                        <span>จำนวนเดิม:</span>
                        <q-badge color="grey-6" rounded>{{ selectedProduct.stockQty }} ชิ้น</q-badge>
                      </div>
                      <div class="change-arrow">
                        <q-icon name="arrow_forward" color="warning" size="24px" />
                      </div>
                      <div class="change-row">
                        <span>จำนวนใหม่:</span>
                        <q-badge :color="newQty > selectedProduct.stockQty ? 'positive' : newQty < selectedProduct.stockQty ? 'negative' : 'grey'" rounded>
                          {{ newQty }} ชิ้น
                        </q-badge>
                      </div>
                    </div>
                    
                    <div class="diff-display">
                      <div class="diff-badge" :class="{
                        'diff-positive': adjustDiff > 0,
                        'diff-negative': adjustDiff < 0,
                        'diff-neutral': adjustDiff === 0
                      }">
                        <q-icon 
                          :name="adjustDiff > 0 ? 'add' : adjustDiff < 0 ? 'remove' : 'drag_handle'" 
                          size="20px" 
                        />
                        <span class="diff-value">
                          {{ adjustDiff > 0 ? '+' : '' }}{{ adjustDiff }}
                        </span>
                      </div>
                    </div>

                    <!-- Reason Display -->
                    <div v-if="adjustReason" class="reason-display">
                      <q-icon name="info_outline" color="info" />
                      <span>{{ reasonOptions.find(r => r.value === adjustReason)?.label }}</span>
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
                color="warning"
                text-color="white"
                icon="save"
                label="บันทึกการปรับปรุง"
                class="action-btn submit-btn adjust-submit"
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
const { recordTransaction, recordAdjustment } = useStock();

onMounted(async () => {
  try {
    await loadProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
  }
});

// Form state
const selectedProductId = ref<number | null>(null);
const newQty = ref<number>(0);
const adjustReason = ref<string>('count');
const note = ref<string>('');
const isSubmitting = ref<boolean>(false);

// Options
const reasonOptions = [
  { label: '📊 นับสต็อกจริง (Physical Count)', value: 'count' },
  { label: '💥 สินค้าชำรุด (Damaged)', value: 'damaged' },
  { label: '🔍 สินค้าสูญหาย (Lost)', value: 'lost' },
  { label: '🔄 การคืนสินค้า (Return)', value: 'return' },
  { label: '⚙️ อื่นๆ (Other)', value: 'other' },
];

// Computed
const selectedProduct = computed((): Product | undefined =>
  products.value.find((p: Product) => p.id === selectedProductId.value)
);

const adjustDiff = computed((): number => {
  if (!selectedProduct.value || newQty.value === null) return 0;
  return newQty.value - selectedProduct.value.stockQty;
});

const canSubmit = computed((): boolean => 
  selectedProductId.value !== null && 
  newQty.value >= 0 && 
  adjustReason.value.length > 0 &&
  adjustDiff.value !== 0  // Only allow if there's an actual change
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
    alert('❌ กรุณากรอกข้อมูลให้ครบถ้วนและมีการเปลี่ยนแปลงจำนวนสต็อก');
    return;
  }

  const product = selectedProduct.value;
  if (!product) return;

  if (adjustDiff.value === 0) {
    alert('❌ ไม่มีการเปลี่ยนแปลงจำนวนสต็อก');
    return;
  }

  isSubmitting.value = true;
  
  try {
    const reasonLabel = reasonOptions.find((r) => r.value === adjustReason.value)?.label || adjustReason.value;

    // Record adjustment & stock transaction via API
    await recordAdjustment({
      adjustmentNumber: `ADJ-${adjustReason.value.toUpperCase()}-${Date.now()}`,
      reason: note.value || adjustReason.value,
      productId: product.id,
      systemQty: product.stockQty,
      actualQty: newQty.value,
    });

    await recordTransaction({
      transactionNumber: `TX-ADJ-${Date.now()}`,
      transactionType: 'ADJUST',
      productId: product.id,
      quantity: Math.abs(adjustDiff.value),
      note: `${reasonLabel}: ${note.value || '-'} (เดิม: ${product.stockQty} → ใหม่: ${newQty.value})`,
    });

    // Update stock level
    await updateProduct(product.id, { stockQty: newQty.value });

    // Show success message with details
    const changeText = adjustDiff.value > 0 ? `+${adjustDiff.value}` : `${adjustDiff.value}`;
    alert(`✅ ปรับปรุงสต็อกเรียบร้อยแล้ว\n\n${product.name}\n${product.stockQty} → ${newQty.value} ชิ้น (${changeText})\n\nเหตุผล: ${reasonLabel}`);
    
    // Redirect to movements page
    await router.push('/stock/movements');
  } catch (error) {
    console.error('Error submitting stock adjustment:', error);
    alert('❌ เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.stock-adjust-page {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
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
  background: rgba(245, 158, 11, 0.1);
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
  color: white;
  padding: 1.5rem 2rem;
}

.adjust-header {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
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

/* Current Stock Card */
.current-stock-card {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 12px;
  padding: 1.5rem;
}

.current-stock-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.current-stock-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary, #1e293b);
}

.current-stock-content .stock-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-weight: 600;
  color: var(--color-text-primary, #1e293b);
}

/* Adjustment Preview */
.adjustment-preview {
  background: #fefce8;
  border: 1px solid #eab308;
  border-radius: 12px;
  padding: 1.5rem;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.preview-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary, #1e293b);
}

.change-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
}

.change-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.change-row span {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #64748b);
  font-weight: 500;
}

.change-arrow {
  display: flex;
  align-items: center;
}

.diff-display {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.diff-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
}

.diff-positive {
  background: rgba(34, 197, 94, 0.2);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.diff-negative {
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.diff-neutral {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.reason-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  font-weight: 500;
  color: var(--color-text-primary, #1e293b);
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

.adjust-submit {
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
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

  .change-summary {
    flex-direction: column;
    gap: 1rem;
  }

  .change-arrow {
    transform: rotate(90deg);
  }
}

@media (max-width: 480px) {
  .stock-adjust-page {
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
