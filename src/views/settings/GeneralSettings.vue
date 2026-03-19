<template>
  <div>
    <n-space vertical :size="24">
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Основные настройки</h2>

      <n-card title="Информация об объекте">
        <n-form :model="formData" label-placement="left" label-width="180" :style="{ maxWidth: '600px' }">
          <n-form-item label="Название площадки">
            <n-input v-model:value="formData.name" placeholder="Название вашей площадки" />
          </n-form-item>

          <n-form-item label="Логотип">
            <n-upload
              action="#"
              :default-upload="false"
              :max="1"
              list-type="image-card"
            >
              Загрузить логотип
            </n-upload>
          </n-form-item>

          <n-form-item label="Часовой пояс">
            <n-select
              v-model:value="formData.timezone"
              :options="timezoneOptions"
              placeholder="Выберите часовой пояс"
            />
          </n-form-item>

          <n-form-item label="Валюта">
            <n-select
              v-model:value="formData.currency"
              :options="currencyOptions"
              placeholder="Выберите валюту"
            />
          </n-form-item>

          <n-form-item>
            <n-button type="primary" @click="handleSave">Сохранить</n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

const formData = reactive({
  name: 'Ледовый дворец «Айсберг»',
  timezone: 'Europe/Moscow',
  currency: 'RUB'
})

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

function handleSave() {
  message.success('Настройки сохранены')
}
</script>
