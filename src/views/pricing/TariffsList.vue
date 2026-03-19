<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px">
      <h2 style="margin: 0; font-size: 24px; font-weight: 700">Тарифы</h2>
      <n-button type="primary" @click="openCreateModal">
        + Создать тариф
      </n-button>
    </div>

    <n-card>
      <n-data-table
        :columns="columns"
        :data="tariffs"
        :bordered="false"
        striped
      />
    </n-card>

    <!-- Create / Edit Modal -->
    <n-modal
      v-model:show="showModal"
      :title="editingItem ? 'Редактирование тарифа' : 'Создание тарифа'"
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
          <n-input v-model:value="modalForm.name" placeholder="Например: Стандартный" />
        </n-form-item>

        <n-form-item label="Slug" path="slug">
          <n-input v-model:value="modalForm.slug" placeholder="Например: standard" />
        </n-form-item>

        <n-form-item label="Описание" path="description">
          <n-input
            v-model:value="modalForm.description"
            type="textarea"
            placeholder="Описание тарифа"
            :rows="2"
          />
        </n-form-item>

        <n-form-item label="Цвет" path="color">
          <n-color-picker
            v-model:value="modalForm.color"
            :swatches="colorSwatches"
            :modes="['hex']"
          />
        </n-form-item>

        <n-form-item label="Порядок сортировки" path="sortOrder">
          <n-input-number
            v-model:value="modalForm.sortOrder"
            :min="0"
            placeholder="0"
            style="width: 100%"
          />
        </n-form-item>

        <n-form-item label="Теги">
          <n-dynamic-tags v-model:value="modalForm.tags" />
        </n-form-item>

        <n-form-item label="Фото">
          <n-upload
            list-type="image-card"
            :max="5"
            :default-upload="false"
            :file-list="modalForm.photos"
            @update:file-list="handlePhotosChange"
          >
            <span v-if="modalForm.photos.length < 5">Добавить</span>
          </n-upload>
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
import { ref, reactive, h } from 'vue'
import { NButton, NSpace, NIcon, NTag } from 'naive-ui'
import { CreateOutline, TrashOutline } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'
import { tariffs } from '../../data/mock.js'

const message = useMessage()

const showModal = ref(false)
const editingItem = ref(null)
const modalFormRef = ref(null)

const colorSwatches = [
  '#2080f0',
  '#18a058',
  '#f0a020',
  '#d03050',
  '#8a2be2',
  '#ff6347',
  '#333333',
  '#909399'
]

const modalForm = reactive({
  name: '',
  slug: '',
  description: '',
  color: '#2080f0',
  sortOrder: 0,
  tags: [],
  photos: []
})

const modalRules = {
  name: { required: true, message: 'Введите название', trigger: 'blur' },
  slug: { required: true, message: 'Введите slug', trigger: 'blur' }
}

function openCreateModal() {
  editingItem.value = null
  modalForm.name = ''
  modalForm.slug = ''
  modalForm.description = ''
  modalForm.color = '#2080f0'
  modalForm.sortOrder = 0
  modalForm.tags = []
  modalForm.photos = []
  showModal.value = true
}

function openEditModal(row) {
  editingItem.value = row
  modalForm.name = row.name
  modalForm.slug = row.slug
  modalForm.description = row.description
  modalForm.color = row.color
  modalForm.sortOrder = row.sortOrder
  modalForm.tags = [...(row.tags || [])]
  modalForm.photos = createUploadFileList(row.photos)
  showModal.value = true
}

function createUploadFileList(photos = []) {
  return photos.map((name, index) => ({
    id: `${name}-${index}`,
    name,
    status: 'finished',
    url: `https://placehold.co/120x120?text=${encodeURIComponent(name)}`
  }))
}

function handlePhotosChange(fileList) {
  modalForm.photos = fileList.slice(0, 5)
}

function handleModalSave() {
  modalFormRef.value?.validate((errors) => {
    if (!errors) {
      if (editingItem.value) {
        editingItem.value.tags = [...modalForm.tags]
        editingItem.value.photos = modalForm.photos.map((file) => file.name).slice(0, 5)
        message.success('Тариф обновлён')
      } else {
        tariffs.push({
          id: Date.now(),
          name: modalForm.name,
          slug: modalForm.slug,
          description: modalForm.description,
          color: modalForm.color,
          sortOrder: modalForm.sortOrder,
          templatesCount: 0,
          tags: [...modalForm.tags],
          photos: modalForm.photos.map((file) => file.name).slice(0, 5)
        })
        message.success('Тариф создан')
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
        h('span', {
          style: {
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            display: 'inline-block',
            background: row.color,
            flexShrink: 0
          }
        }),
        h('span', { style: 'font-weight: 500' }, row.name)
      ])
    }
  },
  {
    title: 'Slug',
    key: 'slug',
    render(row) {
      return h('code', { style: 'padding: 2px 6px; background: #f4f4f5; border-radius: 4px; font-size: 13px' }, row.slug)
    }
  },
  {
    title: 'Описание',
    key: 'description',
    ellipsis: { tooltip: true }
  },
  {
    title: 'Теги',
    key: 'tags',
    width: 220,
    render(row) {
      const tags = row.tags || []
      if (!tags.length) {
        return '—'
      }

      return h(NSpace, { size: 6, wrap: true }, {
        default: () => tags.map((tag) =>
          h(NTag, { size: 'small', round: true, bordered: false }, { default: () => tag })
        )
      })
    }
  },
  {
    title: 'Фото',
    key: 'photos',
    width: 110,
    align: 'center',
    render(row) {
      return (row.photos || []).length
    }
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
      return h(NSpace, { size: 4 }, {
        default: () => [
          h(NButton, {
            quaternary: true,
            circle: true,
            size: 'small',
            onClick: () => openEditModal(row)
          }, {
            icon: () => h(NIcon, { component: CreateOutline })
          }),
          h(NButton, {
            quaternary: true,
            circle: true,
            size: 'small',
            onClick: () => handleDelete(row)
          }, {
            icon: () => h(NIcon, { component: TrashOutline })
          })
        ]
      })
    }
  }
]
</script>
