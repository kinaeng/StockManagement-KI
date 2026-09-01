<template>
  <q-card flat bordered>
    <!-- Header -->
    <q-card-section class="bg-accent text-white row items-center">
      <q-icon name="auto_awesome" size="20px" class="q-mr-sm" />
      <div class="text-subtitle1 text-weight-bold">คำแนะนำการเชื่อมโยงอัตโนมัติ</div>
      <q-space />
      <q-btn 
        flat 
        dense 
        round 
        icon="refresh" 
        @click="refreshSuggestions"
        :loading="loading"
      >
        <q-tooltip>รีเฟรชคำแนะนำ</q-tooltip>
      </q-btn>
    </q-card-section>

    <!-- Content -->
    <q-card-section class="q-pa-md">
      <!-- Description -->
      <div class="text-body2 text-grey-8 q-mb-md">
        ระบบแนะนำการเชื่อมโยงอะไหล่กับรุ่นรถอัตโนมัติ จากการวิเคราะห์รหัสแพลตฟอร์ม และข้อมูลเครื่องยนต์ร่วม
      </div>

      <!-- No suggestions state -->
      <div v-if="!loading && suggestions.length === 0" class="text-center q-py-lg">
        <q-icon name="info_outline" size="48px" class="text-grey-5 q-mb-md" />
        <div class="text-grey-7 text-body1">ไม่มีคำแนะนำการเชื่อมโยงในขณะนี้</div>
        <div class="text-caption text-grey-5">ลองรีเฟรชเพื่อค้นหาคำแนะนำใหม่</div>
      </div>

      <!-- Loading state -->
      <div v-else-if="loading" class="text-center q-py-lg">
        <q-spinner-dots size="40px" color="primary" />
        <div class="text-grey-7 q-mt-md">กำลังค้นหาคำแนะนำ...</div>
      </div>

      <!-- Suggestions list -->
      <div v-else>
        <!-- Bulk actions -->
        <div class="row items-center justify-between q-mb-md" v-if="suggestions.length > 0">
          <div class="text-body2 text-grey-7">
            พบ {{ suggestions.length }} คำแนะนำ
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              size="sm"
              outline
              color="primary"
              icon="select_all"
              label="เลือกทั้งหมด"
              @click="selectAll"
              :disable="allSelected"
              no-caps
            />
            <q-btn
              size="sm"
              color="positive"
              icon="check_circle"
              :label="`ยืนยันที่เลือก (${selectedCount})`"
              @click="confirmSelected"
              :disable="selectedCount === 0"
              :loading="bulkLoading"
              no-caps
            />
          </div>
        </div>

        <!-- Suggestion items -->
        <q-list separator>
          <q-item
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="q-pa-md"
          >
            <!-- Selection checkbox -->
            <q-item-section avatar>
              <q-checkbox
                v-model="suggestion.selected"
                color="primary"
                @update:model-value="updateSelection"
              />
            </q-item-section>

            <!-- Main content -->
            <q-item-section>
              <div class="row q-col-gutter-md">
                <!-- Part info -->
                <div class="col-12 col-md-6">
                  <div class="text-weight-bold text-primary q-mb-xs">
                    {{ getProductName(suggestion.partId) }}
                  </div>
                  <div class="text-caption text-grey-7 q-mb-sm">
                    รหัส: {{ getProductPartNumber(suggestion.partId) }} | 
                    ยี่ห้อ: {{ getProductBrand(suggestion.partId) }}
                  </div>
                  
                  <!-- Vehicle info -->
                  <div class="text-weight-medium text-secondary">
                    {{ getVehicleName(suggestion.vehicleModelId) }}
                  </div>
                  <div class="text-caption text-grey-7">
                    {{ getVehicleDetails(suggestion.vehicleModelId) }}
                  </div>
                </div>

                <!-- Suggestion details -->
                <div class="col-12 col-md-6">
                  <!-- Platform match -->
                  <div class="q-mb-sm">
                    <q-chip
                      size="sm"
                      color="blue-1"
                      text-color="blue-8"
                      icon="account_tree"
                    >
                      แพลตฟอร์ม: {{ suggestion.platformCode }}
                    </q-chip>
                  </div>

                  <!-- Confidence level -->
                  <div class="q-mb-sm">
                    <q-linear-progress
                      :value="suggestion.confidence / 100"
                      :color="getConfidenceColor(suggestion.confidence)"
                      size="6px"
                      class="q-mb-xs"
                    />
                    <div class="text-caption text-grey-7">
                      ความเชื่อมั่น: {{ suggestion.confidence }}%
                      <q-icon 
                        v-if="suggestion.confidence < 70"
                        name="warning" 
                        color="warning" 
                        size="16px" 
                        class="q-ml-xs"
                      >
                        <q-tooltip>ความเชื่อมั่นต่ำ กรุณาตรวจสอบอีกครั้ง</q-tooltip>
                      </q-icon>
                    </div>
                  </div>

                  <!-- Source -->
                  <div class="text-caption text-grey-6">
                    แหล่งข้อมูล: {{ suggestion.source }}
                  </div>
                </div>
              </div>
            </q-item-section>

            <!-- Actions -->
            <q-item-section side class="q-gutter-xs">
              <div class="column q-gutter-xs">
                <q-btn
                  size="sm"
                  round
                  flat
                  color="positive"
                  icon="check"
                  @click="confirmOne(suggestion)"
                  :loading="suggestion.confirming"
                >
                  <q-tooltip>ยืนยัน</q-tooltip>
                </q-btn>
                <q-btn
                  size="sm"
                  round
                  flat
                  color="negative"
                  icon="close"
                  @click="dismissOne(suggestion)"
                  :loading="suggestion.dismissing"
                >
                  <q-tooltip>ปฏิเสธ</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useProducts } from '@/composables/use-products';
import { useVehicles } from '@/composables/use-vehicles';
import * as compatibilityService from '@/services/compatibility.service';
import type { LinkSuggestion } from '@/services/compatibility.service';

// Props
interface Props {
  refreshTrigger?: number;
}

const props = withDefaults(defineProps<Props>(), {
  refreshTrigger: 0,
});

// Emits
const emit = defineEmits<{
  suggestionConfirmed: [suggestion: LinkSuggestion];
  suggestionDismissed: [suggestion: LinkSuggestion];
  bulkConfirmed: [suggestions: LinkSuggestion[]];
}>();

// Extended interface for component state
interface ComponentLinkSuggestion extends LinkSuggestion {
  selected: boolean;
  confirming?: boolean;
  dismissing?: boolean;
}

// Composables
const { products } = useProducts();
const { vehicleModels } = useVehicles();

// State
const suggestions = ref<ComponentLinkSuggestion[]>([]);
const loading = ref(false);
const bulkLoading = ref(false);

// Computed
const selectedCount = computed(() => 
  suggestions.value.filter(s => s.selected).length
);

const allSelected = computed(() => 
  suggestions.value.length > 0 && suggestions.value.every(s => s.selected)
);

// Helper functions
function getProductName(partId: number): string {
  const product = products.value.find(p => p.id === partId);
  return product?.name || 'ไม่พบข้อมูล';
}

function getProductPartNumber(partId: number): string {
  const product = products.value.find(p => p.id === partId);
  return product?.partNumber || '';
}

function getProductBrand(partId: number): string {
  const product = products.value.find(p => p.id === partId);
  return product?.brand || '';
}

function getVehicleName(vehicleId: number): string {
  const vehicle = vehicleModels.value.find(v => v.id === vehicleId);
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'ไม่พบข้อมูล';
}

function getVehicleDetails(vehicleId: number): string {
  const vehicle = vehicleModels.value.find(v => v.id === vehicleId);
  return vehicle ? `${vehicle.yearRange} (${vehicle.engineCc} cc)` : '';
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'positive';
  if (confidence >= 80) return 'light-green';
  if (confidence >= 70) return 'amber';
  return 'warning';
}

// Methods
async function refreshSuggestions(): Promise<void> {
  loading.value = true;
  try {
    const serviceSuggestions = await compatibilityService.getSuggestions({
      excludeDismissed: true,
      maxResults: 8,
      minConfidence: 60,
    });
    
    // Convert to component suggestions with selection state
    suggestions.value = serviceSuggestions.map(s => ({
      ...s,
      selected: false,
    }));
  } catch (error) {
    console.error('Failed to refresh suggestions:', error);
  } finally {
    loading.value = false;
  }
}

function selectAll(): void {
  suggestions.value.forEach(s => s.selected = true);
}

function updateSelection(): void {
  // Reactive update handled by v-model
}

async function confirmOne(suggestion: ComponentLinkSuggestion): Promise<void> {
  suggestion.confirming = true;
  try {
    await compatibilityService.confirmSuggestion(suggestion.id);
    
    // Remove from suggestions
    const index = suggestions.value.findIndex(s => s.id === suggestion.id);
    if (index > -1) {
      suggestions.value.splice(index, 1);
    }
    
    emit('suggestionConfirmed', suggestion);
  } catch (error) {
    console.error('Failed to confirm suggestion:', error);
  } finally {
    suggestion.confirming = false;
  }
}

async function dismissOne(suggestion: ComponentLinkSuggestion): Promise<void> {
  suggestion.dismissing = true;
  try {
    await compatibilityService.dismissSuggestion(suggestion.id);
    
    // Remove from suggestions
    const index = suggestions.value.findIndex(s => s.id === suggestion.id);
    if (index > -1) {
      suggestions.value.splice(index, 1);
    }
    
    emit('suggestionDismissed', suggestion);
  } catch (error) {
    console.error('Failed to dismiss suggestion:', error);
  } finally {
    suggestion.dismissing = false;
  }
}

async function confirmSelected(): Promise<void> {
  const selected = suggestions.value.filter(s => s.selected);
  if (selected.length === 0) return;
  
  bulkLoading.value = true;
  try {
    await compatibilityService.confirmBulkSuggestions(selected.map(s => s.id));
    
    // Remove confirmed suggestions
    suggestions.value = suggestions.value.filter(s => !s.selected);
    
    emit('bulkConfirmed', selected);
  } catch (error) {
    console.error('Failed to confirm selected suggestions:', error);
  } finally {
    bulkLoading.value = false;
  }
}

// Lifecycle
onMounted(() => {
  void refreshSuggestions();
});

// Watch for refresh trigger
watch(() => props.refreshTrigger, () => {
  void refreshSuggestions();
});
</script>

<style lang="scss" scoped>
// Component-specific styles
.q-linear-progress {
  border-radius: 3px;
}

.q-item {
  &:hover {
    background-color: var(--color-bg-surface);
  }
}

// Low confidence warning styling
.q-icon[color="warning"] {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
