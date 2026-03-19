<template>
  <div>
    <n-space vertical :size="24">
      <!-- Header -->
      <n-page-header title="Новый объект" subtitle="Создание нового объекта" @back="router.push('/venues')" />

      <!-- Form -->
      <n-card title="Основная информация">
        <n-form ref="formRef" :model="formData" label-placement="left" label-width="180" :style="{ maxWidth: '700px' }">
          <n-form-item label="Название" path="name" required>
            <n-input v-model:value="formData.name" placeholder="Введите название объекта" />
          </n-form-item>

          <n-form-item label="Тип объекта" path="type" required>
            <n-select v-model:value="formData.type" :options="typeOptions" placeholder="Выберите тип" />
          </n-form-item>

          <n-form-item label="Описание" path="description">
            <n-input
              v-model:value="formData.description"
              type="textarea"
              placeholder="Описание объекта"
              :autosize="{ minRows: 3, maxRows: 6 }"
            />
          </n-form-item>

          <n-form-item label="Адрес" path="address" required>
            <n-input v-model:value="formData.address" placeholder="Полный адрес" />
          </n-form-item>

          <n-form-item label="Город" path="city">
            <n-input v-model:value="formData.city" placeholder="Город" />
          </n-form-item>

          <n-form-item label="Почтовый индекс" path="zip">
            <n-input v-model:value="formData.zip" placeholder="123456" style="width: 200px" />
          </n-form-item>

          <n-form-item label="Координаты" path="coordinates">
            <n-space>
              <n-input-number v-model:value="formData.lat" placeholder="Широта" :precision="6" style="width: 200px" />
              <n-input-number v-model:value="formData.lng" placeholder="Долгота" :precision="6" style="width: 200px" />
            </n-space>
          </n-form-item>

          <n-form-item label="Ссылка Яндекс.Карты" path="yandexMaps">
            <n-input v-model:value="formData.yandexMaps" placeholder="https://yandex.ru/maps/..." />
          </n-form-item>
        </n-form>
      </n-card>

      <n-card title="Контакты">
        <n-form :model="formData" label-placement="left" label-width="180" :style="{ maxWidth: '700px' }">
          <n-form-item label="Телефон" path="phone">
            <n-input v-model:value="formData.phone" placeholder="+7 (___) ___-__-__" />
          </n-form-item>

          <n-form-item label="Email" path="email">
            <n-input v-model:value="formData.email" placeholder="info@venue.ru" />
          </n-form-item>

          <n-form-item label="Сайт" path="website">
            <n-input v-model:value="formData.website" placeholder="https://venue.ru" />
          </n-form-item>
        </n-form>
      </n-card>

      <n-card title="Фотографии">
        <n-upload
          action="#"
          :default-upload="false"
          list-type="image-card"
          :max="10"
        >
          Загрузить фото
        </n-upload>
        <n-text depth="3" style="display: block; margin-top: 8px">
          Рекомендуемый размер: 1200x800 px. Максимум 10 фотографий.
        </n-text>
      </n-card>

      <!-- Actions -->
      <n-space>
        <n-button type="primary" size="large" @click="handleSaveDraft">Сохранить как черновик</n-button>
        <n-button size="large" @click="router.push('/venues')">Отмена</n-button>
      </n-space>
    </n-space>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { venueTypes } from '../../data/mock.js'

const router = useRouter()
const message = useMessage()

const typeOptions = Object.entries(venueTypes).map(([value, label]) => ({ value, label }))

const formData = reactive({
  name: '',
  type: null,
  description: '',
  address: '',
  city: '',
  zip: '',
  lat: null,
  lng: null,
  yandexMaps: '',
  phone: '',
  email: '',
  website: ''
})

function handleSaveDraft() {
  message.success('Объект сохранён как черновик')
  router.push('/venues')
}
</script>
