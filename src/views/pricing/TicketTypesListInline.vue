<template>
  <div>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 16px">
      <n-button type="primary" @click="openCreateModal">+ Создать тип билета</n-button>
    </div>

    <n-data-table :columns="columns" :data="ticketTypes" :bordered="false" striped />

    <n-modal v-model:show="showModal" :title="editingItem ? 'Редактирование типа билета' : 'Создание типа билета'" preset="card" style="max-width: 520px" :mask-closable="false">
      <n-form ref="modalFormRef" :model="modalForm" :rules="modalRules" label-placement="top">
        <n-form-item label="Название" path="name">
          <n-input v-model:value="modalForm.name" placeholder="Например: Взрослый" />
        </n-form-item>
        <n-form-item label="Slug" path="slug">
          <n-input v-model:value="modalForm.slug" placeholder="Например: adult" />
        </n-form-item>
        <n-form-item label="Канал продажи" path="channel">
          <n-select v-model:value="modalForm.channel" :options="channelOptions" placeholder="Выберите канал" />
        </n-form-item>
        <n-form-item label="Описание" path="description">
          <n-input v-model:value="modalForm.description" type="textarea" placeholder="Описание типа билета" :rows="2" />
        </n-form-item>
        <n-form-item label="Порядок сортировки" path="sortOrder">
          <n-input-number v-model:value="modalForm.sortOrder" :min="0" placeholder="0" style="width: 100%" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">Отмена</n-button>
          <n-button type="primary" @click="handleModalSave">{{ editingItem ? 'Сохранить' : 'Создать' }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { CreateOutline, TrashOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { ticketTypes } from '../../data/mock.js'

const message = useMessage()
const showModal = ref(false)
const editingItem = ref(null)
const modalFormRef = ref(null)

const channelOptions = [
  { label: 'Касса', value: 'Касса' },
  { label: 'Веб-магазин', value: 'Веб-магазин' },
  { label: 'Мобильное приложение', value: 'Мобильное приложение' },
  { label: 'Все', value: 'Все' }
]

const modalForm = reactive({ name: '', slug: '', channel: null, description: '', sortOrder: 0 })
const modalRules = {
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  slug: { required: true, message: 'Введите slug', trigger: 'blur' },
  channel: { required: true, message: 'Выберите канал', trigger: 'change' }
}

function openCreateModal() {
  editingItem.value = null
  Object.assign(modalForm, { name: '', slug: '', channel: null, description: '', sortOrder: 0 })
  showModal.value = true
}

function openEditModal(row) {
  editingItem.value = row
  Object.assign(modalForm, { name: row.name, slug: row.slug, channel: row.channel, description: row.description, sortOrder: row.sortOrder })
  showModal.value = true
}

function handleModalSave() {
  modalFormRef.value?.validate((errors) => {
    if (!errors) {
      message.success(editingItem.value ? 'Тип билета обновлён' : 'Тип билета создан')
      showModal.value = false
    }
  })
}

function handleDelete(row) { message.warning(`Удаление "${row.name}" (прототип)`) }

const columns = [
  { title: 'Название', key: 'name', render(row) { return h('span', { style: 'font-weight: 500' }, row.name) } },
  { title: 'Slug', key: 'slug', render(row) { return h('code', { style: 'padding: 2px 6px; background: #f4f4f5; border-radius: 4px; font-size: 13px' }, row.slug) } },
  { title: 'Канал', key: 'channel', width: 160 },
  { title: 'Описание', key: 'description', ellipsis: { tooltip: true } },
  { title: 'Шаблонов', key: 'templatesCount', width: 110, align: 'center' },
  {
    title: 'Действия', key: 'actions', width: 100,
    render(row) {
      return h(NSpace, { size: 4 }, {
        default: () => [
          h(NButton, { quaternary: true, circle: true, size: 'small', onClick: () => openEditModal(row) }, { icon: () => h(NIcon, { component: CreateOutline }) }),
          h(NButton, { quaternary: true, circle: true, size: 'small', onClick: () => handleDelete(row) }, { icon: () => h(NIcon, { component: TrashOutline }) })
        ]
      })
    }
  }
]
</script>
