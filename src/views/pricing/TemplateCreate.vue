<template>
  <div>
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px">
      <n-button quaternary @click="router.push('/pricing/templates')">
        &larr; Назад
      </n-button>
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Создание ценового шаблона</h2>
    </div>

    <n-card>
      <n-steps :current="currentStep" style="margin-bottom: 32px">
        <n-step title="Основные настройки" description="Название и состав шаблона" />
        <n-step title="Матрица цен" description="Заполнение цен" />
      </n-steps>

      <!-- Step 1 -->
      <div v-if="currentStep === 1">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-placement="top"
          style="max-width: 600px"
        >
          <n-form-item label="Название шаблона" path="name">
            <n-input v-model:value="formData.name" placeholder="Например: Будни утро" />
          </n-form-item>

          <n-form-item label="Описание" path="description">
            <n-input
              v-model:value="formData.description"
              type="textarea"
              placeholder="Описание шаблона (необязательно)"
              :rows="3"
            />
          </n-form-item>

          <n-form-item label="Типы билетов" path="selectedTicketTypes">
            <n-checkbox-group v-model:value="formData.selectedTicketTypes">
              <n-space>
                <n-checkbox
                  v-for="tt in ticketTypes"
                  :key="tt.id"
                  :value="tt.id"
                  :label="`${tt.name} (${tt.channel})`"
                />
              </n-space>
            </n-checkbox-group>
          </n-form-item>

          <n-form-item label="Тарифы" path="selectedTariffs">
            <n-checkbox-group v-model:value="formData.selectedTariffs">
              <n-space>
                <n-checkbox
                  v-for="t in tariffs"
                  :key="t.id"
                  :value="t.id"
                  :label="t.name"
                />
              </n-space>
            </n-checkbox-group>
          </n-form-item>

          <n-form-item label="Услуги" path="selectedServices">
            <n-checkbox-group v-model:value="formData.selectedServices">
              <n-space>
                <n-checkbox
                  v-for="s in services"
                  :key="s.id"
                  :value="s.id"
                  :label="`${s.icon} ${s.name}`"
                />
              </n-space>
            </n-checkbox-group>
          </n-form-item>
        </n-form>

        <n-space style="margin-top: 24px">
          <n-button @click="router.push('/pricing/templates')">Отмена</n-button>
          <n-button type="primary" @click="goToStep2" :disabled="!canProceedToStep2">
            Далее &rarr;
          </n-button>
        </n-space>
      </div>

      <!-- Step 2 -->
      <div v-if="currentStep === 2">
        <!-- Warning about unfilled positions -->
        <n-alert
          v-if="unfilledCount > 0"
          type="warning"
          :title="`${unfilledCount} ценовых позиций не заполнены`"
          style="margin-bottom: 24px"
        >
          Незаполненные позиции означают, что билет или услуга для данной комбинации тариф/тип билета будет недоступна для продажи.
        </n-alert>

        <!-- Tickets price matrix -->
        <n-card title="Билеты" style="margin-bottom: 24px">
          <n-table :bordered="true" :single-line="false" size="small">
            <thead>
              <tr>
                <th style="width: 160px">Тариф \ Тип билета</th>
                <th v-for="ttId in formData.selectedTicketTypes" :key="ttId" style="text-align: center">
                  {{ getTicketTypeName(ttId) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tId in formData.selectedTariffs" :key="tId">
                <td style="font-weight: 500">{{ getTariffName(tId) }}</td>
                <td v-for="ttId in formData.selectedTicketTypes" :key="ttId" style="text-align: center; padding: 4px 8px">
                  <n-input-number
                    v-model:value="priceMatrix.tickets[tId][ttId]"
                    :min="0"
                    :step="10"
                    placeholder="0"
                    size="small"
                    style="width: 120px"
                  >
                    <template #suffix>&#8381;</template>
                  </n-input-number>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-card>

        <!-- Services price matrices -->
        <n-card
          v-for="sId in formData.selectedServices"
          :key="sId"
          :title="`${getServiceIcon(sId)} ${getServiceName(sId)}`"
          style="margin-bottom: 24px"
        >
          <n-table :bordered="true" :single-line="false" size="small">
            <thead>
              <tr>
                <th style="width: 160px">Тариф \ Тип билета</th>
                <th v-for="ttId in formData.selectedTicketTypes" :key="ttId" style="text-align: center">
                  {{ getTicketTypeName(ttId) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tId in formData.selectedTariffs" :key="tId">
                <td style="font-weight: 500">{{ getTariffName(tId) }}</td>
                <td v-for="ttId in formData.selectedTicketTypes" :key="ttId" style="text-align: center; padding: 4px 8px">
                  <n-input-number
                    v-model:value="priceMatrix.services[sId][tId][ttId]"
                    :min="0"
                    :step="10"
                    placeholder="0"
                    size="small"
                    style="width: 120px"
                  >
                    <template #suffix>&#8381;</template>
                  </n-input-number>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-card>

        <n-space style="margin-top: 24px">
          <n-button @click="currentStep = 1">&larr; Назад</n-button>
          <n-button type="primary" @click="handleSave">Сохранить</n-button>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { ticketTypes, tariffs, services } from '../../data/mock.js'

const router = useRouter()
const message = useMessage()
const formRef = ref(null)
const currentStep = ref(1)

const formData = reactive({
  name: '',
  description: '',
  selectedTicketTypes: [],
  selectedTariffs: [],
  selectedServices: []
})

const formRules = {
  name: { required: true, message: 'Введите название шаблона', trigger: 'blur' },
  selectedTicketTypes: {
    type: 'array',
    required: true,
    message: 'Выберите хотя бы один тип билета',
    trigger: 'change'
  },
  selectedTariffs: {
    type: 'array',
    required: true,
    message: 'Выберите хотя бы один тариф',
    trigger: 'change'
  }
}

const canProceedToStep2 = computed(() => {
  return formData.name.trim() !== '' &&
    formData.selectedTicketTypes.length > 0 &&
    formData.selectedTariffs.length > 0
})

// Price matrix: tickets[tariffId][ticketTypeId] = price
// services[serviceId][tariffId][ticketTypeId] = price
const priceMatrix = reactive({
  tickets: {},
  services: {}
})

// Initialize price matrix when selections change
watch(
  () => [formData.selectedTariffs, formData.selectedTicketTypes, formData.selectedServices],
  () => {
    // Initialize tickets matrix
    for (const tId of formData.selectedTariffs) {
      if (!priceMatrix.tickets[tId]) priceMatrix.tickets[tId] = {}
      for (const ttId of formData.selectedTicketTypes) {
        if (priceMatrix.tickets[tId][ttId] === undefined) {
          priceMatrix.tickets[tId][ttId] = null
        }
      }
    }
    // Initialize services matrices
    for (const sId of formData.selectedServices) {
      if (!priceMatrix.services[sId]) priceMatrix.services[sId] = {}
      for (const tId of formData.selectedTariffs) {
        if (!priceMatrix.services[sId][tId]) priceMatrix.services[sId][tId] = {}
        for (const ttId of formData.selectedTicketTypes) {
          if (priceMatrix.services[sId][tId][ttId] === undefined) {
            priceMatrix.services[sId][tId][ttId] = null
          }
        }
      }
    }
  },
  { deep: true }
)

const unfilledCount = computed(() => {
  let count = 0
  // Count unfilled ticket prices
  for (const tId of formData.selectedTariffs) {
    for (const ttId of formData.selectedTicketTypes) {
      if (!priceMatrix.tickets[tId] || priceMatrix.tickets[tId][ttId] == null) {
        count++
      }
    }
  }
  // Count unfilled service prices
  for (const sId of formData.selectedServices) {
    for (const tId of formData.selectedTariffs) {
      for (const ttId of formData.selectedTicketTypes) {
        if (!priceMatrix.services[sId] || !priceMatrix.services[sId][tId] || priceMatrix.services[sId][tId][ttId] == null) {
          count++
        }
      }
    }
  }
  return count
})

function getTicketTypeName(id) {
  return ticketTypes.find(t => t.id === id)?.name || ''
}

function getTariffName(id) {
  return tariffs.find(t => t.id === id)?.name || ''
}

function getServiceName(id) {
  return services.find(s => s.id === id)?.name || ''
}

function getServiceIcon(id) {
  return services.find(s => s.id === id)?.icon || ''
}

function goToStep2() {
  if (canProceedToStep2.value) {
    currentStep.value = 2
  }
}

function handleSave() {
  message.success('Шаблон успешно создан')
  router.push('/pricing/templates')
}
</script>
