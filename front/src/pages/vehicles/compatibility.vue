<template>
  <q-page class="q-pa-lg">
    <div class="page-header">
      <h1 class="page-header__title">ตารางเปรียบเทียบความเข้ากันได้อะไหล่</h1>
      <p class="page-header__subtitle">
        เปรียบเทียบและค้นหาว่าอะไหล่แต่ละรุ่นใช้ร่วมกับรุ่นรถไหนได้บ้าง
        หรือรุ่นรถใดใช้อะไหล่เหมือนกัน
      </p>
    </div>

    <!-- Cross-Reference Search Tool -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section class="bg-primary text-white row items-center">
        <q-icon name="search" size="20px" class="q-mr-sm" />
        <div class="text-subtitle1 text-weight-bold">เครื่องมือค้นหาและเชื่อมโยงอะไหล่</div>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <div class="text-body2 text-grey-8 q-mb-md">
          ค้นหาสินค้าและรุ่นรถเพื่อเพิ่มความสัมพันธ์ระหว่างอะไหล่กับรุ่นรถ
        </div>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-5">
            <q-select
              v-model="linkProductId"
              outlined
              dense
              :options="filteredProducts"
              option-label="name"
              option-value="id"
              label="ค้นหาสินค้า / อะไหล่ *"
              emit-value
              map-options
              use-input
              input-debounce="300"
              @filter="filterProducts"
              @input-value="productSearchQuery = $event"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    ไม่พบสินค้าที่ค้นหา "{{ productSearchQuery }}"
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption
                      >รหัส: {{ scope.opt.partNumber }} | ยี่ห้อ:
                      {{ scope.opt.brand }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-5">
            <q-select
              v-model="linkVehicleId"
              outlined
              dense
              :options="filteredVehicles"
              option-label="model"
              option-value="id"
              label="ค้นหารุ่นรถมอเตอร์ไซค์ *"
              emit-value
              map-options
              use-input
              input-debounce="300"
              @filter="filterVehicles"
              @input-value="vehicleSearchQuery = $event"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    ไม่พบรุ่นรถที่ค้นหา "{{ vehicleSearchQuery }}"
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.brand }} {{ scope.opt.model }}</q-item-label>
                    <q-item-label caption
                      >ปี {{ scope.opt.yearRange }} ({{ scope.opt.engineCc }} cc)</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              color="primary"
              icon="add_link"
              label="เชื่อมโยง"
              class="full-width"
              no-caps
              unelevated
              :disable="!linkProductId || !linkVehicleId"
              @click="handleCreateLink"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Comparison & Search Tabs -->
    <q-card flat bordered class="q-mb-lg">
      <q-tabs v-model="tab" class="text-primary bg-grey-2" align="justify">
        <q-tab name="vehicleToParts" icon="directions_bike" label="ค้นหาอะไหล่ตามรุ่นรถ" />
        <q-tab name="crossReference" icon="compare" label="เปรียบเทียบข้ามรุ่น" />
        <q-tab name="autoSuggestions" icon="auto_awesome" label="คำแนะนำอัตโนมัติ" />
        <q-tab name="photoLookup" icon="photo_camera" label="ค้นหาจากรูปรถ" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Tab 1: Vehicle -> Parts -->
        <q-tab-panel name="vehicleToParts">
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="directions_bike" class="q-mr-sm" />
            ค้นหาอะไหล่ที่ใช้ได้กับรุ่นรถ
          </div>

          <div class="row q-col-gutter-md items-center q-mb-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="selectedVehicleId"
                outlined
                dense
                :options="vehicleModels"
                option-label="model"
                option-value="id"
                label="เลือกรุ่นรถมอเตอร์ไซค์"
                emit-value
                map-options
                clearable
              >
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.brand }} {{ scope.opt.model }}</q-item-label>
                      <q-item-label caption
                        >ปี {{ scope.opt.yearRange }} ({{ scope.opt.engineCc }} cc)</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6" v-if="selectedVehicle">
              <q-card flat class="bg-blue-1 q-pa-md">
                <div class="text-caption text-blue-8">รุ่นที่เลือก:</div>
                <div class="text-weight-bold">
                  {{ selectedVehicle.brand }} {{ selectedVehicle.model }}
                </div>
                <div class="text-caption">
                  {{ selectedVehicle.yearRange }} | {{ selectedVehicle.engineCc }} cc
                </div>
              </q-card>
            </div>
          </div>

          <q-card flat bordered v-if="selectedVehicle">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6">
                <q-icon name="build" class="q-mr-sm" />
                อะไหล่ที่ใช้ได้กับ {{ selectedVehicle.brand }} {{ selectedVehicle.model }}
                <q-chip color="white" text-color="primary" class="q-ml-sm"
                  >{{ matchingProducts.length }} รายการ</q-chip
                >
              </div>
            </q-card-section>
            <q-list separator>
              <q-item v-for="part in matchingProducts" :key="part.id">
                <q-item-section avatar>
                  <q-avatar color="blue-1" text-color="blue-8" icon="build" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ part.name }}</q-item-label>
                  <q-item-label caption>
                    รหัส: {{ part.partNumber }} | ยี่ห้อ: {{ part.brand }} | ประเภท: {{ part.type }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side class="row items-center">
                  <div class="column items-end q-mr-md">
                    <div class="text-weight-bold text-primary">
                      ฿{{ part.salePrice?.toLocaleString() }}
                    </div>
                    <q-chip
                      size="xs"
                      :color="part.stockQty > 0 ? 'positive' : 'negative'"
                      text-color="white"
                    >
                      คงเหลือ: {{ part.stockQty }}
                    </q-chip>
                  </div>
                  <q-btn
                    flat
                    round
                    dense
                    icon="link_off"
                    color="negative"
                    size="sm"
                    @click="handleRemoveLink(part.id, selectedVehicle.id)"
                  >
                    <q-tooltip>ยกเลิกการเชื่อมโยง</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-item v-if="matchingProducts.length === 0">
                <q-item-section class="text-center q-py-lg">
                  <div class="text-grey-6">
                    <q-icon name="info" size="48px" class="q-mb-md" />
                    <div>ไม่พบรายการอะไหล่ที่เชื่อมโยงกับรุ่นรถนี้</div>
                    <div class="text-caption">ลองเพิ่มการเชื่อมโยงใหม่ด้านบน</div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-tab-panel>

        <!-- Tab 2: Cross-Reference Comparison -->
        <q-tab-panel name="crossReference">
          <div class="text-h6 text-positive q-mb-md">
            <q-icon name="compare" class="q-mr-sm" />
            เปรียบเทียบข้ามรุ่นรถ
          </div>

          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-md-6">
              <q-select
                v-model="crossRefProductId"
                outlined
                dense
                :options="filteredCrossProducts"
                option-label="name"
                option-value="id"
                label="ค้นหาสินค้าที่ลูกค้าต้องการ *"
                emit-value
                map-options
                clearable
                use-input
                input-debounce="300"
                @filter="filterCrossProducts"
                @input-value="crossProductSearchQuery = $event"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      ไม่พบสินค้าที่ค้นหา "{{ crossProductSearchQuery }}"
                    </q-item-section>
                  </q-item>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                      <q-item-label caption
                        >รหัส: {{ scope.opt.partNumber }} | ยี่ห้อ:
                        {{ scope.opt.brand }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="crossRefVehicleId"
                outlined
                dense
                :options="filteredCrossVehicles"
                option-label="model"
                option-value="id"
                label="ค้นหารุ่นรถของลูกค้า *"
                emit-value
                map-options
                clearable
                use-input
                input-debounce="300"
                @filter="filterCrossVehicles"
                @input-value="crossVehicleSearchQuery = $event"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      ไม่พบรุ่นรถที่ค้นหา "{{ crossVehicleSearchQuery }}"
                    </q-item-section>
                  </q-item>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.brand }} {{ scope.opt.model }}</q-item-label>
                      <q-item-label caption
                        >{{ scope.opt.yearRange }} ({{ scope.opt.engineCc }} cc)</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div v-if="crossRefProduct && crossRefVehicle">
            <!-- Selected Product & Vehicle Info -->
            <q-card flat bordered class="q-mb-lg bg-blue-1">
              <q-card-section>
                <div class="text-h6 text-primary q-mb-md">
                  <q-icon name="info" class="q-mr-sm" />
                  ข้อมูลที่เลือก
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <div class="text-weight-bold text-blue-8">สินค้า:</div>
                    <div>{{ crossRefProduct.name }}</div>
                    <div class="text-caption">
                      {{ crossRefProduct.partNumber }} | {{ crossRefProduct.brand }}
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="text-weight-bold text-blue-8">รุ่นรถของลูกค้า:</div>
                    <div>{{ crossRefVehicle.brand }} {{ crossRefVehicle.model }}</div>
                    <div class="text-caption">
                      {{ crossRefVehicle.yearRange }} ({{ crossRefVehicle.engineCc }} cc)
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Check if selected combination is compatible -->
            <q-card flat bordered class="q-mb-lg" v-if="isCurrentCombinationCompatible">
              <q-card-section class="bg-positive text-white">
                <div class="text-h6">
                  <q-icon name="check_circle" class="q-mr-sm" />
                  ✅ สินค้านี้ใช้ได้กับรุ่นรถของลูกค้า
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="q-mb-lg" v-else>
              <q-card-section class="bg-warning text-white">
                <div class="text-h6">
                  <q-icon name="warning" class="q-mr-sm" />
                  ⚠️ สินค้านี้ยังไม่ได้เชื่อมโยงกับรุ่นรถของลูกค้า
                </div>
              </q-card-section>
            </q-card>

            <!-- Other Compatible Vehicles -->
            <q-card flat bordered v-if="otherCompatibleVehicles.length > 0">
              <q-card-section class="bg-secondary text-white">
                <div class="text-h6">
                  <q-icon name="two_wheeler" class="q-mr-sm" />
                  รุ่นรถอื่นที่ใช้สินค้าเดียวกันได้ ({{ otherCompatibleVehicles.length }} รุ่น)
                </div>
              </q-card-section>
              <q-list separator>
                <q-item v-for="vehicle in otherCompatibleVehicles" :key="vehicle.id">
                  <q-item-section avatar>
                    <q-avatar color="orange-1" text-color="orange-8" icon="two_wheeler" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold"
                      >{{ vehicle.brand }} {{ vehicle.model }}</q-item-label
                    >
                    <q-item-label caption>
                      ปีผลิต: {{ vehicle.yearRange }} | ขนาดเครื่องยนต์: {{ vehicle.engineCc }} cc
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip color="positive" text-color="white" size="sm"> ใช้ได้ </q-chip>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>

            <!-- All Compatible Vehicles Summary -->
            <q-card flat bordered v-if="allCompatibleVehicles.length > 0">
              <q-card-section class="bg-grey-8 text-white">
                <div class="text-subtitle1">
                  <q-icon name="summarize" class="q-mr-sm" />
                  สรุป: สินค้า "{{ crossRefProduct.name }}" ใช้ได้กับรุ่นรถทั้งหมด
                  {{ allCompatibleVehicles.length }} รุ่น
                </div>
              </q-card-section>
              <q-card-section class="q-pa-md">
                <div class="row">
                  <div class="col-12">
                    <q-chip
                      v-for="vehicle in allCompatibleVehicles"
                      :key="vehicle.id"
                      :color="vehicle.id === crossRefVehicleId ? 'primary' : 'grey-5'"
                      :text-color="vehicle.id === crossRefVehicleId ? 'white' : 'dark'"
                      class="q-ma-xs"
                    >
                      {{ vehicle.brand }} {{ vehicle.model }}
                      <q-icon
                        name="star"
                        v-if="vehicle.id === crossRefVehicleId"
                        class="q-ml-xs"
                        size="16px"
                      />
                    </q-chip>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat class="bg-grey-2 q-pa-md" v-if="allCompatibleVehicles.length === 0">
              <div class="text-center text-grey-7">
                <q-icon name="info" size="48px" class="q-mb-md" />
                <div>ไม่พบรุ่นรถที่ใช้สินค้านี้ได้</div>
                <div class="text-caption">ลองเพิ่มการเชื่อมโยงใหม่ด้านบน</div>
              </div>
            </q-card>
          </div>

          <q-card flat class="bg-grey-2 q-pa-md" v-else>
            <div class="text-center text-grey-7">
              <q-icon name="search" size="48px" class="q-mb-md" />
              <div>เลือกสินค้าและรุ่นรถของลูกค้าเพื่อเปรียบเทียบ</div>
              <div class="text-caption">ระบบจะแสดงรุ่นรถอื่นที่ใช้สินค้าเดียวกันได้</div>
            </div>
          </q-card>
        </q-tab-panel>

        <!-- Tab 3: Auto Suggestions -->
        <q-tab-panel name="autoSuggestions">
          <div class="text-h6 text-primary q-mb-md">
            <q-icon name="auto_awesome" class="q-mr-sm" />
            คำแนะนำการเชื่อมโยงอัตโนมัติ
          </div>

          <AutoLinkSuggestions
            :refresh-trigger="autoSuggestionsRefreshTrigger"
            @suggestion-confirmed="handleSuggestionConfirmed"
            @suggestion-dismissed="handleSuggestionDismissed"
            @bulk-confirmed="handleBulkConfirmed"
          />
        </q-tab-panel>

        <!-- Tab 4: Vehicle Photo Lookup -->
        <q-tab-panel name="photoLookup">
          <div class="vehicle-photo-lookup">
            <div class="vehicle-photo-lookup__header">
              <div>
                <div class="text-h6 text-primary q-mb-xs">
                  <q-icon name="photo_camera" class="q-mr-sm" />
                  ค้นหารุ่นรถจากรูปภาพ
                </div>
                <div class="text-body2 text-grey-7">
                  อัปโหลดรูปรถเพื่อจำลองการวิเคราะห์รุ่น ปีผลิต และความใกล้เคียงกับฐานข้อมูลรถในระบบ
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-5">
                <div
                  class="vehicle-photo-lookup__dropzone"
                  :class="{
                    'vehicle-photo-lookup__dropzone--has-image': Boolean(vehiclePhotoPreviewUrl),
                  }"
                >
                  <q-img
                    v-if="vehiclePhotoPreviewUrl"
                    :src="vehiclePhotoPreviewUrl"
                    ratio="4/3"
                    fit="cover"
                    class="vehicle-photo-lookup__preview"
                  />
                  <div v-else class="vehicle-photo-lookup__empty">
                    <q-icon name="add_a_photo" size="56px" color="primary" />
                    <div class="text-weight-bold q-mt-md">เลือกรูปรถสำหรับวิเคราะห์</div>
                    <div class="text-caption text-grey-6">รองรับ JPG, PNG หรือ WEBP</div>
                  </div>
                </div>

                <q-file
                  v-model="vehiclePhotoFile"
                  outlined
                  dense
                  accept="image/*"
                  class="q-mt-md"
                  label="อัปโหลดรูปรถ"
                  clearable
                  @update:model-value="handleVehiclePhotoSelected"
                  @clear="resetVehiclePhotoLookup"
                >
                  <template #prepend>
                    <q-icon name="upload_file" />
                  </template>
                </q-file>

                <div class="row q-col-gutter-sm q-mt-sm">
                  <div class="col-12 col-sm-6">
                    <q-btn
                      color="primary"
                      icon="psychology"
                      label="วิเคราะห์รูป"
                      class="full-width"
                      unelevated
                      :loading="vehiclePhotoAnalyzing"
                      :disable="!vehiclePhotoFile"
                      @click="analyzeVehiclePhoto"
                    />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-btn
                      outline
                      color="grey-8"
                      icon="restart_alt"
                      label="เริ่มใหม่"
                      class="full-width"
                      :disable="!vehiclePhotoFile && !vehiclePhotoResult"
                      @click="resetVehiclePhotoLookup"
                    />
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-7">
                <q-card
                  v-if="vehiclePhotoAnalyzing"
                  flat
                  bordered
                  class="vehicle-photo-lookup__state"
                >
                  <q-card-section class="text-center q-py-xl">
                    <q-spinner-dots color="primary" size="44px" />
                    <div class="text-weight-bold q-mt-md">กำลังวิเคราะห์รูปรถ...</div>
                    <div class="text-caption text-grey-6">
                      กำลังส่งรูปเพื่อวิเคราะห์กับระบบ
                    </div>
                  </q-card-section>
                </q-card>

                <q-card
                  v-else-if="vehiclePhotoResult"
                  flat
                  bordered
                  class="vehicle-photo-lookup__result"
                >
                  <q-card-section>
                    <div class="row items-start q-col-gutter-md">
                      <div class="col">
                        <div class="text-caption text-grey-7">ผลลัพธ์ที่ใกล้เคียงที่สุด</div>
                        <div class="vehicle-photo-lookup__model">
                          {{ vehiclePhotoResult.vehicle.brand }}
                          {{ vehiclePhotoResult.vehicle.model }}
                        </div>
                        <div class="text-body2 text-grey-7">
                          ปี {{ vehiclePhotoResult.vehicle.yearRange }} |
                          {{ vehiclePhotoResult.vehicle.engineCc }} cc
                        </div>
                      </div>
                      <div class="col-auto">
                        <q-circular-progress
                          show-value
                          font-size="13px"
                          :value="vehiclePhotoResult.confidence"
                          size="72px"
                          :thickness="0.16"
                          color="positive"
                          track-color="green-1"
                        >
                          {{ vehiclePhotoResult.confidence }}%
                        </q-circular-progress>
                      </div>
                    </div>

                    <q-separator class="q-my-md" />

                    <div class="text-subtitle2 q-mb-sm">เหตุผลประกอบการวิเคราะห์</div>
                    <div class="row q-col-gutter-sm q-mb-md">
                      <div
                        v-for="signal in vehiclePhotoResult.signals"
                        :key="signal"
                        class="col-12 col-sm-6"
                      >
                        <q-chip
                          class="full-width justify-start"
                          color="blue-1"
                          text-color="blue-9"
                          icon="check_circle"
                        >
                          {{ signal }}
                        </q-chip>
                      </div>
                    </div>

                    <q-btn
                      color="primary"
                      icon="directions_bike"
                      label="ใช้รุ่นนี้ค้นหาอะไหล่"
                      unelevated
                      @click="usePhotoDetectedVehicle(vehiclePhotoResult.vehicle.id)"
                    />
                  </q-card-section>

                  <q-separator />

                  <q-card-section v-if="vehiclePhotoResult.alternatives.length > 0">
                    <div class="text-subtitle2 q-mb-sm">รุ่นใกล้เคียง</div>
                    <q-list bordered separator class="rounded-borders">
                      <q-item
                        v-for="candidate in vehiclePhotoResult.alternatives"
                        :key="candidate.vehicle.id"
                        clickable
                        @click="usePhotoDetectedVehicle(candidate.vehicle.id)"
                      >
                        <q-item-section avatar>
                          <q-avatar color="orange-1" text-color="orange-8" icon="two_wheeler" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label
                            >{{ candidate.vehicle.brand }}
                            {{ candidate.vehicle.model }}</q-item-label
                          >
                          <q-item-label caption>
                            ปี {{ candidate.vehicle.yearRange }} |
                            {{ candidate.vehicle.engineCc }} cc
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-chip size="sm" color="grey-2" text-color="grey-8"
                            >{{ candidate.confidence }}%</q-chip
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>

                <q-card v-else flat bordered class="vehicle-photo-lookup__state">
                  <q-card-section class="text-center q-py-xl">
                    <q-icon name="image_search" size="56px" class="text-grey-5 q-mb-md" />
                    <div class="text-weight-bold text-grey-8">ยังไม่มีผลการวิเคราะห์</div>
                    <div class="text-caption text-grey-6">
                      เลือกรูปแล้วกดวิเคราะห์ ระบบจะแสดงรุ่นรถ ปีผลิต และความมั่นใจ
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useVehicles, type VehicleModel, type CompatibilityMap } from '@/composables/use-vehicles';
import { useProducts, type Product } from '@/composables/use-products';
import AutoLinkSuggestions from '@/components/parts/AutoLinkSuggestions.vue';
import type { LinkSuggestion } from '@/services/compatibility.service';

const tab = ref<'vehicleToParts' | 'crossReference' | 'autoSuggestions' | 'photoLookup'>(
  'vehicleToParts',
);

const { vehicleModels, compatibilities, addCompatibility, removeCompatibility } = useVehicles();
const { products } = useProducts();

// Auto suggestions variables
const autoSuggestionsRefreshTrigger = ref(0);

// Tab 1 variables
const selectedVehicleId = ref<number | null>(1);

// Search variables for linking tool
const linkProductId = ref<number | null>(null);
const linkVehicleId = ref<number | null>(null);
const productSearchQuery = ref<string>('');
const vehicleSearchQuery = ref<string>('');
const filteredProducts = ref(products.value);
const filteredVehicles = ref(vehicleModels.value);

// Tab 2 variables (Cross-Reference)
const crossRefProductId = ref<number | null>(null);
const crossRefVehicleId = ref<number | null>(null);
const crossProductSearchQuery = ref<string>('');
const crossVehicleSearchQuery = ref<string>('');
const filteredCrossProducts = ref(products.value);
const filteredCrossVehicles = ref(vehicleModels.value);

interface VehiclePhotoCandidate {
  vehicle: VehicleModel;
  confidence: number;
}

interface VehiclePhotoResult extends VehiclePhotoCandidate {
  signals: string[];
  alternatives: VehiclePhotoCandidate[];
}

const vehiclePhotoFile = ref<File | null>(null);
const vehiclePhotoPreviewUrl = ref<string | null>(null);
const vehiclePhotoAnalyzing = ref(false);
const vehiclePhotoResult = ref<VehiclePhotoResult | null>(null);

// Computed properties
const selectedVehicle = computed((): VehicleModel | undefined =>
  vehicleModels.value.find((v: VehicleModel) => v.id === selectedVehicleId.value),
);

const matchingProducts = computed((): Product[] => {
  if (!selectedVehicleId.value) return [];
  const productIds = compatibilities.value
    .filter((c: CompatibilityMap) => c.vehicleModelId === selectedVehicleId.value)
    .map((c: CompatibilityMap) => c.productId);
  return products.value.filter((p: Product) => productIds.includes(p.id));
});

// Cross-reference computed properties
const crossRefProduct = computed((): Product | undefined =>
  products.value.find((p: Product) => p.id === crossRefProductId.value),
);

const crossRefVehicle = computed((): VehicleModel | undefined =>
  vehicleModels.value.find((v: VehicleModel) => v.id === crossRefVehicleId.value),
);

const isCurrentCombinationCompatible = computed((): boolean => {
  if (!crossRefProductId.value || !crossRefVehicleId.value) return false;
  return compatibilities.value.some(
    (c) => c.productId === crossRefProductId.value && c.vehicleModelId === crossRefVehicleId.value,
  );
});

const allCompatibleVehicles = computed((): VehicleModel[] => {
  if (!crossRefProductId.value) return [];
  const vehicleIds = compatibilities.value
    .filter((c: CompatibilityMap) => c.productId === crossRefProductId.value)
    .map((c: CompatibilityMap) => c.vehicleModelId);
  return vehicleModels.value.filter((v: VehicleModel) => vehicleIds.includes(v.id));
});

const otherCompatibleVehicles = computed((): VehicleModel[] => {
  return allCompatibleVehicles.value.filter((v: VehicleModel) => v.id !== crossRefVehicleId.value);
});

// Search functions
function filterProducts(val: string, update: (callback: () => void) => void): void {
  update(() => {
    if (val === '') {
      filteredProducts.value = products.value;
    } else {
      const needle = val.toLowerCase();
      filteredProducts.value = products.value.filter(
        (product) =>
          product.name.toLowerCase().includes(needle) ||
          product.partNumber.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle),
      );
    }
  });
}

function filterVehicles(val: string, update: (callback: () => void) => void): void {
  update(() => {
    if (val === '') {
      filteredVehicles.value = vehicleModels.value;
    } else {
      const needle = val.toLowerCase();
      filteredVehicles.value = vehicleModels.value.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(needle) ||
          vehicle.model.toLowerCase().includes(needle) ||
          vehicle.yearRange.toLowerCase().includes(needle),
      );
    }
  });
}

function filterCrossProducts(val: string, update: (callback: () => void) => void): void {
  update(() => {
    if (val === '') {
      filteredCrossProducts.value = products.value;
    } else {
      const needle = val.toLowerCase();
      filteredCrossProducts.value = products.value.filter(
        (product) =>
          product.name.toLowerCase().includes(needle) ||
          product.partNumber.toLowerCase().includes(needle) ||
          product.brand.toLowerCase().includes(needle),
      );
    }
  });
}

function filterCrossVehicles(val: string, update: (callback: () => void) => void): void {
  update(() => {
    if (val === '') {
      filteredCrossVehicles.value = vehicleModels.value;
    } else {
      const needle = val.toLowerCase();
      filteredCrossVehicles.value = vehicleModels.value.filter(
        (vehicle) =>
          vehicle.brand.toLowerCase().includes(needle) ||
          vehicle.model.toLowerCase().includes(needle) ||
          vehicle.yearRange.toLowerCase().includes(needle),
      );
    }
  });
}

function handleCreateLink(): void {
  if (!linkProductId.value || !linkVehicleId.value) {
    alert('กรุณาเลือกทั้งรายการสินค้าและรุ่นรถ');
    return;
  }

  const exists = compatibilities.value.some(
    (c) => c.productId === linkProductId.value && c.vehicleModelId === linkVehicleId.value,
  );

  if (exists) {
    alert('รายการนี้ได้รับการเชื่อมโยงไว้แล้ว');
    return;
  }

  addCompatibility({
    productId: linkProductId.value,
    vehicleModelId: linkVehicleId.value,
  });

  alert('เชื่อมโยงความสัมพันธ์เรียบร้อยแล้ว');
  linkProductId.value = null;
  linkVehicleId.value = null;
}

function handleRemoveLink(productId: number, vehicleId: number): void {
  if (confirm('คุณต้องการยกเลิกการเชื่อมโยงนี้ใช่หรือไม่?')) {
    removeCompatibility(productId, vehicleId);
  }
}

// Auto suggestions event handlers
function handleSuggestionConfirmed(suggestion: LinkSuggestion): void {
  // Add the confirmed suggestion as a compatibility mapping
  addCompatibility({
    productId: suggestion.partId,
    vehicleModelId: suggestion.vehicleModelId,
    note: `อัตโนมัติ: ${suggestion.source} (${suggestion.confidence}%)`,
  });

  // Show success message
  console.log('✅ เชื่อมโยงอัตโนมัติสำเร็จ:', suggestion);
}

function handleSuggestionDismissed(suggestion: LinkSuggestion): void {
  // Log dismissal (in production, this might trigger learning algorithms)
  console.log('❌ ปฏิเสธการแนะนำ:', suggestion);
}

function handleBulkConfirmed(suggestions: LinkSuggestion[]): void {
  // Add all confirmed suggestions
  suggestions.forEach((suggestion) => {
    addCompatibility({
      productId: suggestion.partId,
      vehicleModelId: suggestion.vehicleModelId,
      note: `อัตโนมัติ: ${suggestion.source} (${suggestion.confidence}%)`,
    });
  });

  console.log(`✅ เชื่อมโยงอัตโนมัติ ${suggestions.length} รายการสำเร็จ`);

  // Optionally refresh suggestions to get new ones
  autoSuggestionsRefreshTrigger.value++;
}

function handleVehiclePhotoSelected(file: File | null): void {
  revokeVehiclePhotoPreview();
  vehiclePhotoResult.value = null;

  if (!file) {
    vehiclePhotoFile.value = null;
    return;
  }

  vehiclePhotoFile.value = file;
  vehiclePhotoPreviewUrl.value = URL.createObjectURL(file);
}

function analyzeVehiclePhoto(): void {
  if (!vehiclePhotoFile.value) return;

  vehiclePhotoAnalyzing.value = true;
  vehiclePhotoResult.value = null;
  vehiclePhotoAnalyzing.value = false;
}

function usePhotoDetectedVehicle(vehicleId: number): void {
  selectedVehicleId.value = vehicleId;
  tab.value = 'vehicleToParts';
}

function resetVehiclePhotoLookup(): void {
  vehiclePhotoFile.value = null;
  vehiclePhotoResult.value = null;
  vehiclePhotoAnalyzing.value = false;
  revokeVehiclePhotoPreview();
}

function revokeVehiclePhotoPreview(): void {
  if (vehiclePhotoPreviewUrl.value) {
    URL.revokeObjectURL(vehiclePhotoPreviewUrl.value);
    vehiclePhotoPreviewUrl.value = null;
  }
}

onBeforeUnmount(() => {
  revokeVehiclePhotoPreview();
});
</script>

<style lang="scss" scoped>
.vehicle-photo-lookup {
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }

  &__dropzone {
    min-height: 280px;
    border: 1px dashed #93c5fd;
    border-radius: var(--radius-lg);
    background: #eff6ff;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__dropzone--has-image {
    border-style: solid;
    background: #ffffff;
  }

  &__preview {
    width: 100%;
    height: 100%;
  }

  &__empty {
    min-height: 260px;
    padding: 32px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__state,
  &__result {
    min-height: 280px;
    background: #ffffff;
  }

  &__model {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-main);
    line-height: var(--line-height-tight);
    margin-top: 4px;
    margin-bottom: 4px;
  }
}

@media (max-width: 599px) {
  .vehicle-photo-lookup {
    &__header {
      display: block;
    }

    &__header .q-chip {
      margin-top: 12px;
    }

    &__model {
      font-size: var(--font-size-xl);
    }
  }
}
</style>
