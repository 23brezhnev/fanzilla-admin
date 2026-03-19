<template>
  <div>
    <n-space vertical :size="24">
      <!-- Header -->
      <n-space justify="space-between" align="center">
        <n-space align="center" :size="12">
          <n-button quaternary circle @click="router.push('/events')">
            &larr;
          </n-button>
          <h2 style="margin: 0; font-size: 24px; font-weight: 700">Создание события</h2>
        </n-space>
      </n-space>

      <n-form ref="formRef" :model="form" :rules="rules" label-placement="top" label-width="auto">
        <!-- Step 1: Event Type Selection -->
        <n-card title="Тип события">
          <n-radio-group v-model:value="form.type" size="large">
            <n-space :size="16">
              <n-card
                v-for="t in eventTypes"
                :key="t.value"
                hoverable
                :style="{
                  width: '220px',
                  cursor: 'pointer',
                  border: form.type === t.value ? '2px solid #1A56FF' : '2px solid transparent'
                }"
                @click="form.type = t.value"
              >
                <div style="text-align: center">
                  <div style="font-size: 32px; margin-bottom: 8px">{{ t.icon }}</div>
                  <div style="font-weight: 600; font-size: 16px">{{ t.label }}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 4px">{{ typeDescriptions[t.value] }}</div>
                </div>
              </n-card>
            </n-space>
          </n-radio-group>
        </n-card>

        <!-- Step 2: Event Details (dynamic by type) -->
        <n-card title="Данные события">
          <n-grid :cols="2" :x-gap="24" :y-gap="0">
            <!-- Common: Venue -->
            <n-gi>
              <n-form-item label="Площадка" path="venue">
                <n-select
                  v-model:value="form.venue"
                  :options="venueOptions"
                  placeholder="Выберите площадку"
                />
              </n-form-item>
            </n-gi>

            <!-- Standard: Name -->
            <n-gi v-if="form.type === 'standard'">
              <n-form-item label="Название" path="name">
                <n-input v-model:value="form.name" placeholder="Введите название события" />
              </n-form-item>
            </n-gi>

            <!-- Standard: Description -->
            <n-gi :span="2" v-if="form.type === 'standard'">
              <n-form-item label="Описание">
                <n-input
                  v-model:value="form.description"
                  type="textarea"
                  placeholder="Описание события"
                  :rows="3"
                />
              </n-form-item>
            </n-gi>

            <!-- Match: Tournament -->
            <n-gi v-if="form.type === 'match'">
              <n-form-item label="Турнир" path="tournament">
                <n-input v-model:value="form.tournament" placeholder="Например: КХЛ" />
              </n-form-item>
            </n-gi>

            <!-- Match: Stage -->
            <n-gi v-if="form.type === 'match'">
              <n-form-item label="Стадия" path="stage">
                <n-input v-model:value="form.stage" placeholder="Например: Плей-офф, 1/4 финала" />
              </n-form-item>
            </n-gi>

            <!-- Match: Home Team -->
            <n-gi v-if="form.type === 'match'">
              <n-form-item label="Домашняя команда" path="teamHome">
                <n-input v-model:value="form.teamHome" placeholder="Название команды" />
              </n-form-item>
            </n-gi>

            <!-- Match: Away Team -->
            <n-gi v-if="form.type === 'match'">
              <n-form-item label="Гостевая команда" path="teamAway">
                <n-input v-model:value="form.teamAway" placeholder="Название команды" />
              </n-form-item>
            </n-gi>

            <!-- Common: Date -->
            <n-gi>
              <n-form-item label="Дата" path="date">
                <n-date-picker
                  v-model:value="form.date"
                  type="date"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <!-- Time Start -->
            <n-gi>
              <n-form-item label="Время начала" path="timeStart">
                <n-time-picker
                  v-model:value="form.timeStart"
                  format="HH:mm"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <!-- Session: Duration -->
            <n-gi v-if="form.type === 'session'">
              <n-form-item label="Продолжительность (мин)" path="duration">
                <n-input-number
                  v-model:value="form.duration"
                  :min="15"
                  :max="240"
                  :step="15"
                  placeholder="45"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <!-- Match: Gate Opening -->
            <n-gi v-if="form.type === 'match'">
              <n-form-item label="Открытие ворот">
                <n-time-picker
                  v-model:value="form.gateOpening"
                  format="HH:mm"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <!-- Standard: Time End -->
            <n-gi v-if="form.type === 'standard'">
              <n-form-item label="Время окончания">
                <n-time-picker
                  v-model:value="form.timeEnd"
                  format="HH:mm"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <!-- Common: Pricing Template -->
            <n-gi>
              <n-form-item label="Ценовой шаблон" path="pricingTemplate">
                <n-select
                  v-model:value="form.pricingTemplate"
                  :options="pricingTemplateOptions"
                  placeholder="Выберите шаблон"
                  @update:value="handleTemplateChange"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-card>

        <!-- Step 3: Price Categories Table -->
        <n-card title="Ценовые категории" v-if="form.pricingTemplate">
          <n-data-table
            :columns="priceCatColumns"
            :data="priceCategoriesData"
            :bordered="false"
            :single-line="false"
          />
        </n-card>

        <!-- Step 4: Publish Status -->
        <n-card title="Статус публикации">
          <n-radio-group v-model:value="form.publishStatus">
            <n-space :size="16">
              <n-radio-button value="draft">Черновик</n-radio-button>
              <n-radio-button value="published">Опубликовать</n-radio-button>
            </n-space>
          </n-radio-group>
        </n-card>

        <!-- Actions -->
        <n-space justify="end" :size="12">
          <n-button @click="router.push('/events')">Отмена</n-button>
          <n-button type="primary" @click="handleSubmit">Сохранить</n-button>
        </n-space>
      </n-form>
    </n-space>
  </div>
</template>

<script setup>
import { ref, reactive, computed, h, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { NInputNumber } from 'naive-ui'
import { eventTypes, venues, pricingTemplates, priceCategories, tariffs, ticketTypes, templatePrices } from '../../data/mock.js'
import { selectedVenueFilter } from '../../stores/workspace.js'

const router = useRouter()
const message = useMessage()
const formRef = ref(null)

const typeDescriptions = {
  session: 'Массовое катание, развлечения с фиксированным временем',
  match: 'Спортивное мероприятие с командами и турниром',
  standard: 'Концерт, шоу, фестиваль и другие события'
}

const venueOptions = computed(() => {
  const scopedVenues = selectedVenueFilter.value === 'all'
    ? venues
    : venues.filter(v => v.id === selectedVenueFilter.value)

  return scopedVenues.map(v => ({
    label: v.name,
    value: v.id
  }))
})

const pricingTemplateOptions = pricingTemplates
  .filter(t => t.status === 'active')
  .map(t => ({
    label: t.name,
    value: t.id
  }))

const form = reactive({
  type: 'session',
  venue: null,
  name: '',
  description: '',
  date: null,
  timeStart: null,
  timeEnd: null,
  duration: 45,
  pricingTemplate: null,
  tournament: '',
  stage: '',
  teamHome: '',
  teamAway: '',
  gateOpening: null,
  publishStatus: 'draft'
})

watch(
  () => selectedVenueFilter.value,
  (value) => {
    form.venue = value === 'all' ? null : value
  },
  { immediate: true }
)

const rules = {
  venue: { required: true, type: 'number', message: 'Выберите площадку', trigger: 'change' },
  date: { required: true, type: 'number', message: 'Укажите дату', trigger: 'change' },
  timeStart: { required: true, type: 'number', message: 'Укажите время начала', trigger: 'change' },
  pricingTemplate: { required: true, type: 'number', message: 'Выберите шаблон', trigger: 'change' },
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  tournament: { required: true, message: 'Введите турнир', trigger: 'blur' },
  teamHome: { required: true, message: 'Введите домашнюю команду', trigger: 'blur' },
  teamAway: { required: true, message: 'Введите гостевую команду', trigger: 'blur' }
}

const priceCategoriesData = ref([])

function handleTemplateChange(templateId) {
  // Load price categories based on selected template
  // Use priceCategories for stadium venues or generate generic ones
  const selectedVenue = venues.find(v => v.id === form.venue)
  if (selectedVenue && selectedVenue.type === 'stadium') {
    priceCategoriesData.value = priceCategories
      .filter(c => c.venueId === form.venue)
      .map(c => ({
        ...c,
        editableCapacity: c.seatsCount || 0
      }))
  } else {
    // Generate from tariffs for non-stadium venues
    priceCategoriesData.value = tariffs.map(t => ({
      id: t.id,
      name: t.name,
      color: t.color,
      basePrice: templatePrices[templateId]?.tickets?.[t.id]?.[1] || 0,
      editableCapacity: 0
    }))
  }
}

const priceCatColumns = [
  {
    title: 'Категория',
    key: 'name',
    render(row) {
      return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        h('div', {
          style: `width: 12px; height: 12px; border-radius: 50%; background: ${row.color}`
        }),
        h('span', { style: 'font-weight: 500' }, row.name)
      ])
    }
  },
  {
    title: 'Базовая цена',
    key: 'basePrice',
    width: 140,
    render(row) {
      return row.basePrice ? row.basePrice.toLocaleString('ru-RU') + ' \u20BD' : '\u2014'
    }
  },
  {
    title: 'Вместимость',
    key: 'editableCapacity',
    width: 180,
    render(row, index) {
      return h(NInputNumber, {
        value: row.editableCapacity,
        min: 0,
        step: 10,
        size: 'small',
        style: 'width: 140px',
        'onUpdate:value': (val) => {
          priceCategoriesData.value[index].editableCapacity = val || 0
        }
      })
    }
  },
  {
    title: 'Мест / Секторов',
    key: 'info',
    render(row) {
      if (row.seatsCount) return `${row.seatsCount.toLocaleString('ru-RU')} мест`
      if (row.sectorsCount) return `${row.sectorsCount} секторов`
      return '\u2014'
    }
  }
]

function handleSubmit() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('Событие создано (mock)')
      router.push('/events')
    } else {
      message.error('Заполните обязательные поля')
    }
  })
}
</script>
