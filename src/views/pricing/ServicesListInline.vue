<template>
  <div>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 16px">
      <n-button type="primary" @click="openCreateModal">+ Создать услугу</n-button>
    </div>

    <n-data-table :columns="columns" :data="services" :bordered="false" striped />

    <n-modal v-model:show="showModal" :title="editingItem ? 'Редактирование услуги' : 'Создание услуги'" preset="card" style="max-width: 520px" :mask-closable="false">
      <n-form ref="modalFormRef" :model="modalForm" :rules="modalRules" label-placement="top">
        <n-form-item label="Название" path="name">
          <n-input v-model:value="modalForm.name" placeholder="Например: Прокат коньков" />
        </n-form-item>
        <n-form-item label="Slug" path="slug">
          <n-input v-model:value="modalForm.slug" placeholder="Например: skate-rental" />
        </n-form-item>
        <n-form-item label="Категория" path="category">
          <n-select v-model:value="modalForm.category" :options="categoryOptions" placeholder="Выберите категорию" />
        </n-form-item>
        <n-form-item label="Иконка (эмодзи)" path="icon">
          <n-input v-model:value="modalForm.icon" placeholder="🎿" style="width: 120px" />
        </n-form-item>
        <n-form-item label="Описание" path="description">
          <n-input v-model:value="modalForm.description" type="textarea" placeholder="Описание услуги" :rows="2" />
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
import { NButton, NSpace, NIcon, NTag } from 'naive-ui'
import { CreateOutline, TrashOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { services } from '../../data/mock.js'

const message = useMessage()
const showModal = ref(false)
const editingItem = ref(null)
const modalFormRef = ref(null)

const categoryOptions = [
  { label: 'Прокат', value: 'Прокат' },
  { label: 'Обучение', value: 'Обучение' },
  { label: 'Сервис', value: 'Сервис' },
  { label: 'Питание', value: 'Питание' },
  { label: 'Другое', value: 'Другое' }
]
const categoryColors = { 'Прокат': 'info', 'Обучение': 'success', 'Сервис': 'warning', 'Питание': 'error', 'Другое': 'default' }

const modalForm = reactive({ name: '', slug: '', category: null, icon: '', description: '' })
const modalRules = {
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  slug: { required: true, message: 'Введите slug', trigger: 'blur' },
  category: { required: true, message: 'Выберите категорию', trigger: 'change' }
}

function openCreateModal() {
  editingItem.value = null
  Object.assign(modalForm, { name: '', slug: '', category: null, icon: '', description: '' })
  showModal.value = true
}

function openEditModal(row) {
  editingItem.value = row
  Object.assign(modalForm, { name: row.name, slug: row.slug, category: row.category, icon: row.icon, description: row.description })
  showModal.value = true
}

function handleModalSave() {
  modalFormRef.value?.validate((errors) => {
    if (!errors) {
      message.success(editingItem.value ? 'Услуга обновлена' : 'Услуга создана')
      showModal.value = false
    }
  })
}

function handleDelete(row) { message.warning(`Удаление "${row.name}" (прототип)`) }

const columns = [
  {
    title: 'Название', key: 'name',
    render(row) {
      return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        h('span', { style: 'font-size: 18px' }, row.icon),
        h('span', { style: 'font-weight: 500' }, row.name)
      ])
    }
  },
  { title: 'Slug', key: 'slug', render(row) { return h('code', { style: 'padding: 2px 6px; background: #f4f4f5; border-radius: 4px; font-size: 13px' }, row.slug) } },
  {
    title: 'Категория', key: 'category', width: 140,
    render(row) {
      return h(NTag, { type: categoryColors[row.category] || 'default', size: 'small', bordered: false }, { default: () => row.category })
    }
  },
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
