<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Цены</h2>
      <n-button v-if="activeTab === 'templates'" type="primary" @click="router.push('/pricing/templates/create')">
        + Создать шаблон
      </n-button>
    </div>

    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="templates" tab="Ценовые шаблоны">
        <TemplatesList />
      </n-tab-pane>
      <n-tab-pane name="tariffs" tab="Тарифы">
        <TariffsList />
      </n-tab-pane>
      <n-tab-pane name="ticket-types" tab="Типы билетов">
        <TicketTypesList />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TemplatesList from './TemplatesListInline.vue'
import TariffsList from './TariffsListInline.vue'
import TicketTypesList from './TicketTypesListInline.vue'

const router = useRouter()
const route = useRoute()

const availableTabs = new Set(['templates', 'tariffs', 'ticket-types'])
const activeTab = ref(availableTabs.has(route.query.tab) ? route.query.tab : 'templates')

watch(activeTab, (tab) => {
  router.replace({ path: '/pricing', query: { tab } })
})

watch(() => route.query.tab, (tab) => {
  const normalizedTab = availableTabs.has(tab) ? tab : 'templates'
  if (normalizedTab !== activeTab.value) {
    activeTab.value = normalizedTab
  }
})
</script>
