<template>
  <div>
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px">
      <n-button quaternary @click="router.push('/pricing/templates')">
        &larr; Назад
      </n-button>
      <div v-if="!editingName" style="display: flex; align-items: center; gap: 8px">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700; cursor: pointer" @click="editingName = true">
          {{ templateName }}
        </h2>
        <n-button text size="small" @click="editingName = true">
          <template #icon><n-icon :component="CreateOutline" /></template>
        </n-button>
      </div>
      <div v-else style="display: flex; align-items: center; gap: 8px">
        <n-input
          v-model:value="templateName"
          style="width: 320px; font-size: 18px"
          autofocus
          @keyup.enter="editingName = false"
        />
        <n-button size="small" @click="editingName = false">OK</n-button>
      </div>
      <n-tag :type="template.status === 'active' ? 'success' : 'default'" size="small">
        {{ template.status === 'active' ? 'Активен' : 'Архив' }}
      </n-tag>
    </div>

    <n-space vertical :size="16">
      <!-- Info bar -->
      <n-card size="small">
        <n-space align="center" :size="24">
          <n-badge :value="template.eventsCount" :max="99" type="info">
            <span style="padding-right: 8px">Используется в событиях</span>
          </n-badge>
          <span v-if="hasChanges" style="color: #f0a020; font-weight: 500">
            Изменения затронут {{ template.eventsCount }} событий
          </span>
        </n-space>
      </n-card>

      <!-- Tabs -->
      <n-card>
        <n-tabs v-model:value="activeTab" type="line">
          <n-tab-pane name="tickets" tab="Билеты">
            <div style="margin-bottom: 16px">
              <n-space>
                <n-button size="small" @click="addTariff">+ Тариф</n-button>
                <n-button size="small" @click="addTicketType">+ Тип билета</n-button>
              </n-space>
            </div>

            <n-table :bordered="true" :single-line="false" size="small">
              <thead>
                <tr>
                  <th style="width: 160px">Тариф \ Тип билета</th>
                  <th
                    v-for="ttId in selectedTicketTypeIds"
                    :key="ttId"
                    style="text-align: center; min-width: 120px"
                  >
                    {{ getTicketTypeName(ttId) }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tId in selectedTariffIds" :key="tId">
                  <td>
                    <n-space align="center" :size="8">
                      <span
                        :style="{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          display: 'inline-block',
                          background: getTariffColor(tId)
                        }"
                      />
                      <span style="font-weight: 500">{{ getTariffName(tId) }}</span>
                    </n-space>
                  </td>
                  <td
                    v-for="ttId in selectedTicketTypeIds"
                    :key="ttId"
                    style="text-align: center; padding: 4px 8px"
                  >
                    <n-input-number
                      :value="ticketPrices[tId]?.[ttId] ?? null"
                      @update:value="(v) => updateTicketPrice(tId, ttId, v)"
                      :min="0"
                      :step="10"
                      placeholder="--"
                      size="small"
                      style="width: 120px"
                      :class="{ 'price-changed': isTicketPriceChanged(tId, ttId) }"
                      :style="isTicketPriceChanged(tId, ttId) ? 'border: 2px solid #f0a020; border-radius: 4px' : ''"
                    >
                      <template #suffix>&#8381;</template>
                    </n-input-number>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-tab-pane>

          <n-tab-pane name="services" tab="Услуги">
            <div style="margin-bottom: 16px">
              <n-space>
                <n-button size="small" @click="addService">+ Услуга</n-button>
              </n-space>
            </div>

            <n-card
              v-for="sId in selectedServiceIds"
              :key="sId"
              :title="`${getServiceIcon(sId)} ${getServiceName(sId)}`"
              size="small"
              style="margin-bottom: 16px"
            >
              <n-table :bordered="true" :single-line="false" size="small">
                <thead>
                  <tr>
                    <th style="width: 160px">Тариф \ Тип билета</th>
                    <th
                      v-for="ttId in selectedTicketTypeIds"
                      :key="ttId"
                      style="text-align: center; min-width: 120px"
                    >
                      {{ getTicketTypeName(ttId) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tId in selectedTariffIds" :key="tId">
                    <td>
                      <n-space align="center" :size="8">
                        <span
                          :style="{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            background: getTariffColor(tId)
                          }"
                        />
                        <span style="font-weight: 500">{{ getTariffName(tId) }}</span>
                      </n-space>
                    </td>
                    <td
                      v-for="ttId in selectedTicketTypeIds"
                      :key="ttId"
                      style="text-align: center; padding: 4px 8px"
                    >
                      <n-input-number
                        :value="servicePrices[sId]?.[tId]?.[ttId] ?? null"
                        @update:value="(v) => updateServicePrice(sId, tId, ttId, v)"
                        :min="0"
                        :step="10"
                        placeholder="--"
                        size="small"
                        style="width: 120px"
                        :style="isServicePriceChanged(sId, tId, ttId) ? 'border: 2px solid #f0a020; border-radius: 4px' : ''"
                      >
                        <template #suffix>&#8381;</template>
                      </n-input-number>
                    </td>
                  </tr>
                </tbody>
              </n-table>
            </n-card>

            <n-empty v-if="selectedServiceIds.length === 0" description="Нет выбранных услуг" />
          </n-tab-pane>
        </n-tabs>
      </n-card>

      <!-- Actions -->
      <n-space>
        <n-button @click="handleCancel">Отмена</n-button>
        <n-button type="primary" :disabled="!hasChanges" @click="handleSave">
          Сохранить
        </n-button>
      </n-space>
    </n-space>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { CreateOutline } from '@vicons/ionicons5'
import { pricingTemplates, tariffs, ticketTypes, services, templatePrices } from '../../data/mock.js'

const router = useRouter()
const route = useRoute()
const message = useMessage()

const templateId = Number(route.params.id)
const template = pricingTemplates.find(t => t.id === templateId) || pricingTemplates[0]

const editingName = ref(false)
const templateName = ref(template.name)
const activeTab = ref('tickets')

// Selected IDs - based on template prices data (or fallback to all)
const priceData = templatePrices[templateId]

const selectedTariffIds = ref(
  priceData
    ? Object.keys(priceData.tickets).map(Number)
    : tariffs.map(t => t.id)
)

const selectedTicketTypeIds = ref(
  priceData && priceData.tickets[selectedTariffIds.value[0]]
    ? Object.keys(priceData.tickets[selectedTariffIds.value[0]]).map(Number)
    : ticketTypes.map(t => t.id)
)

const selectedServiceIds = ref(
  priceData && priceData.services
    ? Object.keys(priceData.services).map(Number)
    : []
)

// Initialize price matrices from mock data
function initTicketPrices() {
  const prices = {}
  for (const tId of selectedTariffIds.value) {
    prices[tId] = {}
    for (const ttId of selectedTicketTypeIds.value) {
      prices[tId][ttId] = priceData?.tickets?.[tId]?.[ttId] ?? null
    }
  }
  return prices
}

function initServicePrices() {
  const prices = {}
  for (const sId of selectedServiceIds.value) {
    prices[sId] = {}
    for (const tId of selectedTariffIds.value) {
      prices[sId][tId] = {}
      for (const ttId of selectedTicketTypeIds.value) {
        prices[sId][tId][ttId] = priceData?.services?.[sId]?.[tId]?.[ttId] ?? null
      }
    }
  }
  return prices
}

const ticketPrices = reactive(initTicketPrices())
const servicePrices = reactive(initServicePrices())

// Keep original prices for change detection
const originalTicketPrices = JSON.parse(JSON.stringify(ticketPrices))
const originalServicePrices = JSON.parse(JSON.stringify(servicePrices))

function updateTicketPrice(tariffId, ticketTypeId, value) {
  if (!ticketPrices[tariffId]) ticketPrices[tariffId] = {}
  ticketPrices[tariffId][ticketTypeId] = value
}

function updateServicePrice(serviceId, tariffId, ticketTypeId, value) {
  if (!servicePrices[serviceId]) servicePrices[serviceId] = {}
  if (!servicePrices[serviceId][tariffId]) servicePrices[serviceId][tariffId] = {}
  servicePrices[serviceId][tariffId][ticketTypeId] = value
}

function isTicketPriceChanged(tariffId, ticketTypeId) {
  const original = originalTicketPrices[tariffId]?.[ticketTypeId]
  const current = ticketPrices[tariffId]?.[ticketTypeId]
  return original !== current
}

function isServicePriceChanged(serviceId, tariffId, ticketTypeId) {
  const original = originalServicePrices[serviceId]?.[tariffId]?.[ticketTypeId]
  const current = servicePrices[serviceId]?.[tariffId]?.[ticketTypeId]
  return original !== current
}

const hasChanges = computed(() => {
  // Check ticket prices
  for (const tId of selectedTariffIds.value) {
    for (const ttId of selectedTicketTypeIds.value) {
      if (isTicketPriceChanged(tId, ttId)) return true
    }
  }
  // Check service prices
  for (const sId of selectedServiceIds.value) {
    for (const tId of selectedTariffIds.value) {
      for (const ttId of selectedTicketTypeIds.value) {
        if (isServicePriceChanged(sId, tId, ttId)) return true
      }
    }
  }
  // Check name change
  if (templateName.value !== template.name) return true
  return false
})

function getTicketTypeName(id) {
  return ticketTypes.find(t => t.id === id)?.name || ''
}

function getTariffName(id) {
  return tariffs.find(t => t.id === id)?.name || ''
}

function getTariffColor(id) {
  return tariffs.find(t => t.id === id)?.color || '#999'
}

function getServiceName(id) {
  return services.find(s => s.id === id)?.name || ''
}

function getServiceIcon(id) {
  return services.find(s => s.id === id)?.icon || ''
}

function addTariff() {
  message.info('Добавление тарифа (прототип)')
}

function addTicketType() {
  message.info('Добавление типа билета (прототип)')
}

function addService() {
  message.info('Добавление услуги (прототип)')
}

function handleSave() {
  message.success('Изменения сохранены')
  router.push('/pricing/templates')
}

function handleCancel() {
  router.push('/pricing/templates')
}
</script>
