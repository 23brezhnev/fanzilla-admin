<template>
  <div>
    <n-space vertical :size="24">
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Основные настройки</h2>

      <n-card title="Глобальные настройки продукта">
        <n-form :model="globalProductSettings" label-placement="left" label-width="220" :style="{ maxWidth: '760px' }">
          <n-form-item label="Название продукта">
            <n-input v-model:value="globalProductSettings.productName" placeholder="Название продукта" />
          </n-form-item>

          <n-form-item label="Email поддержки">
            <n-input v-model:value="globalProductSettings.supportEmail" placeholder="support@product.ru" />
          </n-form-item>

          <n-form-item label="Часовой пояс по умолчанию">
            <n-select
              v-model:value="globalProductSettings.timezone"
              :options="timezoneOptions"
              placeholder="Выберите часовой пояс"
            />
          </n-form-item>

          <n-form-item label="Валюта по умолчанию">
            <n-select
              v-model:value="globalProductSettings.currency"
              :options="currencyOptions"
              placeholder="Выберите валюту"
            />
          </n-form-item>

          <n-form-item label="Резерв заказа (минуты)">
            <n-input-number v-model:value="globalProductSettings.bookingHoldMinutes" :min="5" :max="120" />
          </n-form-item>

          <n-form-item label="Программа лояльности">
            <n-radio-group v-model:value="globalProductSettings.loyaltyMode">
              <n-space>
                <n-radio-button value="shared">Общая на всю систему</n-radio-button>
                <n-radio-button value="per-venue">Отдельно по объектам</n-radio-button>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item label="Каталог продукта">
            <n-radio-group v-model:value="globalProductSettings.catalogMode">
              <n-space>
                <n-radio-button value="shared">Единый для всех объектов</n-radio-button>
                <n-radio-button value="per-venue">Переопределение по объектам</n-radio-button>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item>
            <n-button type="primary" @click="handleGlobalSave">Сохранить глобальные настройки</n-button>
          </n-form-item>
        </n-form>
      </n-card>

      <n-card title="Настройки объекта">
        <n-space vertical :size="16">
          <n-alert v-if="!currentVenue" type="info" :show-icon="false">
            Выберите объект в глобальном фильтре слева, чтобы настроить параметры конкретной площадки.
          </n-alert>

          <template v-else>
            <n-text depth="3">Сейчас редактируется объект: <strong>{{ currentVenue.name }}</strong></n-text>

            <n-form :model="currentVenueSettings" label-placement="left" label-width="220" :style="{ maxWidth: '760px' }">
              <n-form-item label="Публичное название">
                <n-input v-model:value="currentVenue.name" placeholder="Название объекта" />
              </n-form-item>

              <n-form-item label="Контактный email">
                <n-input v-model:value="currentVenueSettings.contactEmail" placeholder="venue@product.ru" />
              </n-form-item>

              <n-form-item label="Часовой пояс объекта">
                <n-select
                  v-model:value="currentVenueSettings.timezone"
                  :options="timezoneOptions"
                  placeholder="Выберите часовой пояс"
                />
              </n-form-item>

              <n-form-item label="Валюта объекта">
                <n-select
                  v-model:value="currentVenueSettings.currency"
                  :options="currencyOptions"
                  placeholder="Выберите валюту"
                />
              </n-form-item>

              <n-form-item label="Префикс билетов">
                <n-input v-model:value="currentVenueSettings.ticketPrefix" placeholder="PREFIX" />
              </n-form-item>

              <n-form-item label="Открывать вход за (минут)">
                <n-input-number v-model:value="currentVenueSettings.checkInOpensMinutes" :min="0" :max="180" />
              </n-form-item>

              <n-form-item>
                <n-button type="primary" @click="handleVenueSave">Сохранить настройки объекта</n-button>
              </n-form-item>
            </n-form>
          </template>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { venues } from '../../data/mock.js'
import { currentVenueSettings, globalProductSettings, selectedVenueFilter } from '../../stores/workspace.js'

const message = useMessage()

const timezoneOptions = [
  { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
  { value: 'Europe/Samara', label: 'Самара (UTC+4)' },
  { value: 'Asia/Yekaterinburg', label: 'Екатеринбург (UTC+5)' },
  { value: 'Asia/Novosibirsk', label: 'Новосибирск (UTC+7)' },
  { value: 'Asia/Vladivostok', label: 'Владивосток (UTC+10)' }
]

const currencyOptions = [
  { value: 'RUB', label: 'Российский рубль (\u20BD)' },
  { value: 'USD', label: 'Доллар США ($)' },
  { value: 'EUR', label: 'Евро (\u20AC)' }
]

const currentVenue = computed(() => {
  if (selectedVenueFilter.value === 'all') return null
  return venues.find(venue => venue.id === selectedVenueFilter.value) || null
})

function handleGlobalSave() {
  message.success('Глобальные настройки продукта сохранены')
}

function handleVenueSave() {
  message.success('Настройки объекта сохранены')
}
</script>
