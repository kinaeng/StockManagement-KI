<template>
  <q-page class="q-pa-lg">
      <!-- Page Header -->
      <div class="page-header row items-center justify-between">
        <div>
          <h1 class="page-header__title">แดชบอร์ดสรุปภาพรวม</h1>
          <p class="page-header__subtitle">
            ภาพรวมสต็อกอะไหล่มอเตอร์ไซค์และสถานะสินค้าคงคลัง
          </p>
        </div>
        <q-btn
          outline
          color="primary"
          icon="refresh"
          label="รีเฟรชข้อมูล"
          no-caps
          size="sm"
        />
      </div>

      <!-- Stat Cards -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stat-card stat-card--blue">
            <q-card-section class="row items-center justify-between q-pa-md">
              <div>
                <div class="stat-card__label">รายการอะไหล่ทั้งหมด</div>
                <div class="stat-card__value">{{ totalProducts }}</div>
              </div>
              <div class="stat-card__icon stat-card__icon--blue">
                <q-icon name="inventory_2" size="24px" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stat-card stat-card--amber">
            <q-card-section class="row items-center justify-between q-pa-md">
              <div>
                <div class="stat-card__label">สต็อกใกล้หมด (Alert)</div>
                <div class="stat-card__value">{{ lowStockCount }}</div>
              </div>
              <div class="stat-card__icon stat-card__icon--amber">
                <q-icon name="warning" size="24px" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stat-card stat-card--green">
            <q-card-section class="row items-center justify-between q-pa-md">
              <div>
                <div class="stat-card__label">มูลค่าสินค้าคงคลังรวม</div>
                <div class="stat-card__value">฿{{ totalStockValue.toLocaleString() }}</div>
              </div>
              <div class="stat-card__icon stat-card__icon--green">
                <q-icon name="payments" size="24px" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stat-card stat-card--purple">
            <q-card-section class="row items-center justify-between q-pa-md">
              <div>
                <div class="stat-card__label">การเคลื่อนไหววันนี้</div>
                <div class="stat-card__value">{{ todayMovementsCount }}</div>
              </div>
              <div class="stat-card__icon stat-card__icon--purple">
                <q-icon name="swap_horiz" size="24px" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Two-column layout: Low Stock + Recent Activity -->
      <div class="row q-col-gutter-md">
        <!-- Low Stock Alerts -->
        <div class="col-12 col-lg-6">
          <q-card flat bordered class="full-height">
            <q-card-section class="row items-center justify-between q-pb-none">
              <div class="text-h6 text-weight-bold" style="color: var(--color-text-main)">
                <q-icon name="warning" color="amber-8" class="q-mr-xs" />
                สินค้าสต็อกต่ำ (Reorder Alert)
              </div>
              <q-btn
                flat
                dense
                no-caps
                color="negative"
                icon="add_shopping_cart"
                label="สร้าง PO"
                size="sm"
                to="/stock/alerts"
              />
            </q-card-section>

            <q-card-section>
              <q-list separator v-if="lowStockProducts.length > 0">
                <q-item v-for="item in lowStockProducts" :key="item.id">
                  <q-item-section avatar>
                    <q-icon name="priority_high" color="negative" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ item.name }}</q-item-label>
                    <q-item-label caption>{{ item.partNumber }} | {{ item.category }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip color="negative" text-color="white" size="sm" dense>
                      คงเหลือ: {{ item.stockQty }} / {{ item.reorderPoint }}
                    </q-chip>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-center q-pa-md text-grey-5">
                <q-icon name="check_circle" size="36px" class="q-mb-sm" />
                <div>ไม่มีสินค้าที่ต่ำกว่าจุดสั่งซื้อ</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Recent Stock Movements -->
        <div class="col-12 col-lg-6">
          <q-card flat bordered class="full-height">
            <q-card-section class="row items-center justify-between q-pb-none">
              <div class="text-h6 text-weight-bold" style="color: var(--color-text-main)">
                <q-icon name="history" color="primary" class="q-mr-xs" />
                กิจกรรมเคลื่อนไหวล่าสุด
              </div>
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                icon="visibility"
                label="ดูทั้งหมด"
                size="sm"
                to="/stock/movements"
              />
            </q-card-section>

            <q-card-section>
              <q-list separator v-if="recentMovements.length > 0">
                <q-item v-for="mov in recentMovements" :key="mov.id">
                  <q-item-section avatar>
                    <q-icon
                      :name="mov.type === 'IN' ? 'input' : mov.type === 'OUT' ? 'output' : 'edit_note'"
                      :color="mov.type === 'IN' ? 'positive' : mov.type === 'OUT' ? 'negative' : 'warning'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ mov.productName }}</q-item-label>
                    <q-item-label caption>{{ mov.refDocument }} | {{ mov.createdAt }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <span
                      class="text-weight-bold"
                      :class="{
                        'text-positive': mov.type === 'IN',
                        'text-negative': mov.type === 'OUT',
                        'text-warning': mov.type === 'ADJUST',
                      }"
                    >
                      {{ mov.type === 'IN' ? '+' : mov.type === 'OUT' ? '-' : '~' }}{{ mov.quantity }}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
              <div v-else class="text-center q-pa-md text-grey-5">
                <q-icon name="inbox" size="36px" class="q-mb-sm" />
                <div>ยังไม่มีกิจกรรมเคลื่อนไหว</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useProducts, type Product } from '@/composables/use-products';
import { useStock } from '@/composables/use-stock';

const { products, totalProducts, lowStockCount } = useProducts();
const { stockMovements } = useStock();

const totalStockValue = computed((): number =>
  products.value.reduce((sum: number, p: Product) => sum + p.costPrice * p.stockQty, 0),
);

const todayMovementsCount = computed((): number => {
  const today = new Date().toISOString().substring(0, 10);
  return stockMovements.value.filter((m) => m.createdAt.startsWith(today)).length;
});

const lowStockProducts = computed((): Product[] =>
  products.value.filter((p: Product) => p.stockQty <= p.reorderPoint),
);

const recentMovements = computed(() => stockMovements.value.slice(0, 5));
</script>
