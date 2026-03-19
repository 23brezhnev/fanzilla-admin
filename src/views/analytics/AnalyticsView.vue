<template>
  <div>
    <n-space vertical :size="24">
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Аналитика</h2>

      <!-- Stat Cards -->
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-card>
            <n-statistic label="Выручка за месяц" :value="formatNumber(stats.revenue)">
              <template #suffix>&nbsp;&#8381;</template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Билетов продано" :value="formatNumber(stats.tickets)" />
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Конверсия" :value="stats.conversion">
              <template #suffix>%</template>
            </n-statistic>
          </n-card>
        </n-gi>
        <n-gi>
          <n-card>
            <n-statistic label="Средний чек" :value="formatNumber(stats.avgCheck)">
              <template #suffix>&nbsp;&#8381;</template>
            </n-statistic>
          </n-card>
        </n-gi>
      </n-grid>

      <!-- Placeholder -->
      <n-card>
        <n-result status="info" title="Дашборды и отчёты скоро будут доступны" description="Расширенная аналитика с графиками, воронками и когортным анализом появится в ближайшем обновлении" />
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
const stats = {
  revenue: 12450000,
  tickets: 8420,
  conversion: 4.2,
  avgCheck: 1478
}

function formatNumber(num) {
  return num.toLocaleString('ru-RU')
}
</script>
