<template>
  <div>
    <n-page-header title="Услуги" style="margin-bottom: 24px">
      <template #extra>
        <n-button type="primary" @click="openCreateModal">
          Создать услугу
        </n-button>
      </template>
    </n-page-header>

    <n-card>
      <n-data-table
        :columns="columns"
        :data="services"
        :bordered="false"
        striped
      />
    </n-card>

    <!-- Create / Edit Modal -->
    <n-modal
      v-model:show="showModal"
      :title="editingItem ? 'Редактирование услуги' : 'Создание услуги'"
      preset="card"
      style="max-width: 520px"
      :mask-closable="false"
    >
      <n-form
        ref="modalFormRef"
        :model="modalForm"
        :rules="modalRules"
        label-placement="top"
      >
        <n-form-item label="Название" path="name">
          <n-input v-model:value="modalForm.name" placeholder="Например: Прокат коньков" />
        </n-form-item>

        <n-form-item label="Slug" path="slug">
          <n-input v-model:value="modalForm.slug" placeholder="Например: skate-rental" />
        </n-form-item>

        <n-form-item label="Категория" path="category">
          <n-select
            v-model:value="modalForm.category"
            :options="categoryOptions"
            placeholder="Выберите категорию"
          />
        </n-form-item>

        <n-form-item label="Иконка (эмодзи)" path="icon">
          <n-input v-model:value="modalForm.icon" placeholder="Например: &#x1F3BF;" style="width: 120px" />
        </n-form-item>

        <n-form-item label="Описание" path="description">
          <n-input
            v-model:value="modalForm.description"
            type="textarea"
            placeholder="Описание услуги"
            :rows="2"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">Отмена</n-button>
          <n-button type="primary" @click="handleModalSave">
            {{ editingItem ? 'Сохранить' : 'Создать' }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, h } from 'vue'
import { NButton, NSpace, NTag } from 'naive-ui'
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

const categoryColors = {
  'Прокат': 'info',
  'Обучение': 'success',
  'Сервис': 'warning',
  'Питание': 'error',
  'Другое': 'default'
}

const modalForm = reactive({
  name: '',
  slug: '',
  category: null,
  icon: '',
  description: ''
})

const modalRules = {
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  slug: { required: true, message: 'Введите slug', trigger: 'blur' },
  category: { required: true, message: 'Выберите категорию', trigger: 'change' }
}

function openCreateModal() {
  editingItem.value = null
  modalForm.name = ''
  modalForm.slug = ''
  modalForm.category = null
  modalForm.icon = ''
  modalForm.description = ''
  showModal.value = true
}

function openEditModal(row) {
  editingItem.value = row
  modalForm.name = row.name
  modalForm.slug = row.slug
  modalForm.category = row.category
  modalForm.icon = row.icon
  modalForm.description = row.description
  showModal.value = true
}

function handleModalSave() {
  modalFormRef.value?.validate((errors) => {
    if (!errors) {
      if (editingItem.value) {
        message.success('Услуга обновлена')
      } else {
        message.success('Услуга создана')
      }
      showModal.value = false
    }
  })
}

function handleDelete(row) {
  message.warning(`Удаление "${row.name}" (прототип)`)
}

const columns = [
  {
    title: 'Название',
    key: 'name',
    render(row) {
      return h('div', { style: 'display: flex; align-items: center; gap: 8px' }, [
        h('span', { style: 'font-size: 18px' }, row.icon),
        h('span', { style: 'font-weight: 500' }, row.name)
      ])
    }
  },
  {
    title: 'Slug',
    key: 'slug',
    width: 160
  },
  {
    title: 'Категория',
    key: 'category',
    width: 140,
    render(row) {
      return h(NTag, {
        type: categoryColors[row.category] || 'default',
        size: 'small',
        bordered: false
      }, { default: () => row.category })
    }
  },
  {
    title: 'Описание',
    key: 'description',
    ellipsis: { tooltip: true }
  },
  {
    title: 'Шаблонов',
    key: 'templatesCount',
    width: 110,
    align: 'center'
  },
  {
    title: 'Действия',
    key: 'actions',
    width: 100,
    render(row) {
      return h(NSpace, { size: 8, justify: 'end' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            quaternary: true,
            onClick: () => openEditModal(row)
          }, { default: () => 'Изменить' }),
          h(NButton, {
            size: 'small',
            quaternary: true,
            onClick: () => handleDelete(row)
          }, { default: () => 'Удалить' })
        ]
      })
    }
  }
]
</script>
