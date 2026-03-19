<template>
  <div>
    <!-- Header -->
    <n-space justify="space-between" align="center" style="margin-bottom: 20px">
      <n-space align="center">
        <h2 style="margin: 0; font-size: 22px; font-weight: 700">Сегменты</h2>
        <n-tag :bordered="false" type="info" size="small">{{ segments.length }}</n-tag>
      </n-space>
      <n-button type="primary" size="small" @click="handleCreate">
        <template #icon><span style="font-size: 14px">+</span></template>
        Создать сегмент
      </n-button>
    </n-space>

    <!-- Summary Stats -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px">
      <n-card size="small">
        <n-statistic label="Всего сегментов" :value="segments.length" />
      </n-card>
      <n-card size="small">
        <n-statistic label="Гостей в сегментах" :value="totalGuests" />
      </n-card>
      <n-card size="small">
        <n-statistic label="Общая выручка">
          <template #default>
            <span>{{ formatCompact(totalRevenue) }}</span>
          </template>
          <template #suffix> &#8381;</template>
        </n-statistic>
      </n-card>
      <n-card size="small">
        <n-statistic label="Средний LTV">
          <template #default>
            <span>{{ totalGuests > 0 ? formatNumber(Math.round(totalRevenue / totalGuests)) : 0 }}</span>
          </template>
          <template #suffix> &#8381;</template>
        </n-statistic>
      </n-card>
    </div>

    <!-- Segment Cards -->
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px">
      <n-card
        v-for="seg in segments"
        :key="seg.id"
        size="small"
        hoverable
        style="transition: box-shadow 0.2s"
      >
        <template #header>
          <n-space align="center" :size="10">
            <div
              :style="{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: seg.color,
                flexShrink: 0
              }"
            />
            <span style="font-weight: 600; font-size: 16px">{{ seg.name }}</span>
            <n-tag
              :bordered="false"
              size="small"
              :type="seg.isAuto ? 'success' : 'warning'"
              round
            >
              {{ seg.isAuto ? 'Авто' : 'Ручной' }}
            </n-tag>
          </n-space>
        </template>
        <template #header-extra>
          <n-space :size="4">
            <n-button size="tiny" secondary @click="handleEdit(seg)">Редактировать</n-button>
          </n-space>
        </template>

        <p style="color: #666; font-size: 13px; margin: 0 0 16px">{{ seg.description }}</p>

        <!-- Segment Metrics -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px">
          <div class="seg-metric">
            <div class="seg-metric-value">{{ seg.guestsCount }}</div>
            <div class="seg-metric-label">Гостей</div>
          </div>
          <div class="seg-metric">
            <div class="seg-metric-value">{{ formatCompact(seg.totalRevenue) }} &#8381;</div>
            <div class="seg-metric-label">Выручка</div>
          </div>
          <div class="seg-metric">
            <div class="seg-metric-value">{{ formatNumber(seg.avgCheck) }} &#8381;</div>
            <div class="seg-metric-label">Средний чек</div>
          </div>
        </div>

        <!-- Rules -->
        <div style="background: #f5f5f7; border-radius: 6px; padding: 10px 12px">
          <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px">
            Правило сегментации
          </div>
          <div style="font-size: 13px; color: #333">{{ seg.rules }}</div>
        </div>

        <!-- Actions footer -->
        <div style="margin-top: 12px; display: flex; justify-content: flex-end">
          <n-button
            size="small"
            text
            type="primary"
            @click="handleViewGuests(seg)"
          >
            Гости сегмента →
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { segments } from '../../data/mock.js'

const router = useRouter()

// --- Computed Stats ---
const totalGuests = computed(() => segments.reduce((sum, s) => sum + s.guestsCount, 0))
const totalRevenue = computed(() => segments.reduce((sum, s) => sum + s.totalRevenue, 0))

// --- Formatters ---
function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}

function formatCompact(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toLocaleString('ru-RU')
}

// --- Handlers ---
function handleCreate() {
  window.$message?.info('Создание сегмента (демо)')
}

function handleEdit(seg) {
  window.$message?.info(`Редактирование сегмента «${seg.name}» (демо)`)
}

function handleViewGuests(seg) {
  // Navigate to guests list — in real app would pass filter param
  router.push('/crm/guests')
  window.$message?.info(`Гости сегмента «${seg.name}»`)
}
</script>

<style scoped>
.seg-metric {
  text-align: center;
  padding: 8px 0;
}
.seg-metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}
.seg-metric-label {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
</style>
