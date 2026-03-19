<template>
  <n-layout has-sider style="min-height: 100vh">
    <!-- Sidebar -->
    <n-layout-sider
      bordered
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="260"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
      :native-scrollbar="false"
      style="background: #fff"
    >
      <!-- Workspace Switcher -->
      <div class="workspace-switcher" :class="{ 'workspace-switcher--collapsed': collapsed }">
        <n-popselect
          v-model:value="currentWorkspaceId"
          :options="workspaceSelectOptions"
          trigger="click"
          @update:value="handleWorkspaceSelect"
        >
          <div class="workspace-trigger">
            <div class="workspace-avatar" :style="{ background: currentWorkspace.color }">
              {{ currentWorkspace.initials }}
            </div>
            <template v-if="!collapsed">
              <div class="workspace-info">
                <div class="workspace-name">{{ currentWorkspace.name }}</div>
                <div class="workspace-plan">{{ currentWorkspace.plan }}</div>
              </div>
              <span style="margin-left: auto; opacity: 0.4; font-size: 14px">⌄</span>
            </template>
          </div>
        </n-popselect>

        <div v-if="!collapsed" class="venue-context">
          <div class="venue-context__header">
            <span class="venue-context__title">Контекст объекта</span>
            <span class="venue-context__count">{{ venueFilterOptions.length - 1 }}</span>
          </div>
          <div class="venue-context__list">
            <button
              v-for="option in venueFilterOptions"
              :key="option.value"
              type="button"
              class="venue-context__chip"
              :class="{ 'venue-context__chip--active': selectedVenueFilter === option.value }"
              @click="selectedVenueFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <n-menu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="20"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuSelect"
        :render-label="renderMenuLabel"
      />
    </n-layout-sider>

    <!-- Main Content -->
    <n-layout>
      <!-- Header -->
      <n-layout-header bordered style="height: 60px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; background: #fff">
        <div style="display: flex; align-items: center; gap: 16px">
          <n-breadcrumb>
            <n-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.path" @click="$router.push(crumb.path)">
              {{ crumb.label }}
            </n-breadcrumb-item>
          </n-breadcrumb>
        </div>
        <div style="display: flex; align-items: center; gap: 16px">
          <n-badge :value="3" :max="9">
            <n-button quaternary circle>
              <template #icon><n-icon :component="NotificationsOutline" /></template>
            </n-button>
          </n-badge>
          <n-dropdown :options="userMenuOptions" @select="handleUserMenu">
            <n-button quaternary>
              <template #icon>
                <n-avatar round size="small" style="background: #1A56FF; cursor: pointer">АИ</n-avatar>
              </template>
              <span style="margin-left: 8px">Александр И.</span>
            </n-button>
          </n-dropdown>
        </div>
      </n-layout-header>

      <!-- Content -->
      <n-layout-content style="padding: 24px">
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import {
  HomeOutline,
  CalendarOutline,
  PricetagsOutline,
  CartOutline,
  CubeOutline,
  LockClosedOutline,
  PeopleOutline,
  StatsChartOutline,
  SettingsOutline,
  HelpCircleOutline,
  NotificationsOutline,
  LogOutOutline,
  PersonOutline,
  BusinessOutline
} from '@vicons/ionicons5'
import { venues } from '../data/mock.js'
import { currentWorkspaceId, selectedVenueFilter } from '../stores/workspace.js'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)

// --- Workspaces ---
const workspaces = [
  { id: 1, name: 'Каток Лужники', initials: 'КЛ', color: '#1A56FF', plan: 'Pro' },
  { id: 2, name: 'Аквакомплекс Лужники', initials: 'АЛ', color: '#18a058', plan: 'Pro' },
  { id: 3, name: 'Центральный стадион Лужники', initials: 'ЦС', color: '#d03050', plan: 'Enterprise' },
]

const currentWorkspace = computed(() =>
  workspaces.find(w => w.id === currentWorkspaceId.value) || workspaces[0]
)

const workspaceSelectOptions = workspaces.map(w => ({
  label: w.name,
  value: w.id,
}))

const venueFilterOptions = computed(() => [
  { label: 'Все объекты', value: 'all' },
  ...venues.map(v => ({
    label: v.name,
    value: v.id,
  }))
])

function handleWorkspaceSelect(id) {
  currentWorkspaceId.value = id
  window.$message?.success(`Переключено на «${workspaces.find(w => w.id === id)?.name}»`)
  // Navigate to dashboard on workspace switch
  router.push('/dashboard')
}

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: 'Главная',
    key: 'dashboard',
    icon: renderIcon(HomeOutline)
  },
  {
    label: 'Расписание',
    key: 'events',
    icon: renderIcon(CalendarOutline),
    children: [
      { label: 'Управление событиями', key: 'events-list' },
    ]
  },
  {
    label: 'Цены',
    key: 'pricing',
    icon: renderIcon(PricetagsOutline)
  },
  {
    label: 'Продажи',
    key: 'sales',
    icon: renderIcon(CartOutline),
    children: [
      { label: 'Заказы', key: 'sales-orders' },
      { label: 'Билеты', key: 'sales-tickets' },
      { label: 'Промо', key: 'sales-promo' },
    ]
  },
  {
    label: 'Выдача',
    key: 'fulfillment',
    icon: renderIcon(CubeOutline),
    children: [
      { label: 'Прокат', key: 'fulfillment-rental' },
      { label: 'История выдач', key: 'fulfillment-history' },
    ]
  },
  {
    label: 'Доступ',
    key: 'access',
    icon: renderIcon(LockClosedOutline),
    children: [
      { label: 'Журнал проходов', key: 'access-log' },
      { label: 'Зоны и входы', key: 'access-zones' },
      { label: 'Устройства', key: 'access-devices' },
    ]
  },
  {
    label: 'Гости',
    key: 'crm',
    icon: renderIcon(PeopleOutline),
    children: [
      { label: 'База гостей', key: 'crm-guests' },
      { label: 'Сегменты', key: 'crm-segments' },
      { label: 'Программа лояльности', key: 'crm-loyalty' },
    ]
  },
  {
    label: 'Аналитика',
    key: 'analytics',
    icon: renderIcon(StatsChartOutline)
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: 'Настройки',
    key: 'settings',
    icon: renderIcon(SettingsOutline),
    children: [
      { label: 'Основные', key: 'settings-general' },
      { label: 'Объекты', key: 'settings-venues' },
      { label: 'Команда', key: 'settings-team' },
      { label: 'Каналы продаж', key: 'settings-channels' },
      { label: 'Интеграции', key: 'settings-integrations' },
    ]
  },
]

const routeMap = {
  'dashboard': '/dashboard',
  'events-list': '/events',
  'pricing': '/pricing',
  'sales-orders': '/sales/orders',
  'sales-tickets': '/sales/tickets',
  'sales-promo': '/sales/promo',
  'fulfillment-rental': '/fulfillment/rental',
  'fulfillment-history': '/fulfillment/history',
  'access-log': '/access/log',
  'access-zones': '/access/zones',
  'access-devices': '/access/devices',
  'crm-guests': '/crm/guests',
  'crm-segments': '/crm/segments',
  'crm-loyalty': '/crm/loyalty',
  'settings-venues': '/venues',
  'analytics': '/analytics',
  'settings-general': '/settings/general',
  'settings-team': '/settings/team',
  'settings-channels': '/settings/channels',
  'settings-integrations': '/settings/integrations',
}

const reverseRouteMap = Object.fromEntries(
  Object.entries(routeMap).map(([k, v]) => [v, k])
)

const activeKey = computed(() => {
  const path = route.path
  if (reverseRouteMap[path]) return reverseRouteMap[path]
  if (path.startsWith('/events')) return 'events-list'
  if (path.startsWith('/sales/orders')) return 'sales-orders'
  if (path.startsWith('/sales/tickets')) return 'sales-tickets'
  if (path.startsWith('/pricing')) return 'pricing'
  if (path.startsWith('/venues')) return 'settings-venues'
  if (path.startsWith('/crm/guests')) return 'crm-guests'
  if (path.startsWith('/crm/segments')) return 'crm-segments'
  if (path.startsWith('/crm/loyalty')) return 'crm-loyalty'
  return 'dashboard'
})

const breadcrumbs = computed(() => {
  const crumbs = [{ label: 'Главная', path: '/dashboard' }]
  const path = route.path

  if (path.startsWith('/events')) {
    crumbs.push({ label: 'Расписание', path: '/events' })
    if (path.includes('/create')) crumbs.push({ label: 'Создание события', path: path })
    else if (route.params.id) crumbs.push({ label: 'Карточка события', path: path })
  } else if (path.startsWith('/sales/orders')) {
    crumbs.push({ label: 'Продажи', path: '/sales/orders' })
    crumbs.push({ label: 'Заказы', path: '/sales/orders' })
    if (route.params.id) crumbs.push({ label: `#${route.params.id}`, path: path })
  } else if (path.startsWith('/sales/tickets')) {
    crumbs.push({ label: 'Продажи', path: '/sales/orders' })
    crumbs.push({ label: 'Билеты', path: '/sales/tickets' })
  } else if (path.startsWith('/pricing')) {
    crumbs.push({ label: 'Цены', path: '/pricing' })
    if (path.includes('/templates/create')) crumbs.push({ label: 'Создание шаблона', path: path })
    else if (path.includes('/templates/') && route.params.id) crumbs.push({ label: 'Редактирование шаблона', path: path })
  } else if (path.startsWith('/venues')) {
    crumbs.push({ label: 'Настройки', path: '/settings/general' })
    crumbs.push({ label: 'Объекты', path: '/venues' })
    if (path.includes('/create')) crumbs.push({ label: 'Новый объект', path: path })
    else if (route.params.id) crumbs.push({ label: 'Карточка объекта', path: path })
  } else if (path.startsWith('/analytics')) {
    crumbs.push({ label: 'Аналитика', path: '/analytics' })
  } else if (path.startsWith('/settings')) {
    crumbs.push({ label: 'Настройки', path: '/settings/general' })
  } else if (path.startsWith('/crm/guests')) {
    crumbs.push({ label: 'Гости', path: '/crm/guests' })
    crumbs.push({ label: 'База гостей', path: '/crm/guests' })
    if (route.params.id) crumbs.push({ label: 'Карточка гостя', path: path })
  } else if (path.startsWith('/crm/segments')) {
    crumbs.push({ label: 'Гости', path: '/crm/guests' })
    crumbs.push({ label: 'Сегменты', path: '/crm/segments' })
  } else if (path.startsWith('/crm')) {
    crumbs.push({ label: 'Гости', path: '/crm/guests' })
  } else if (path.startsWith('/access')) {
    crumbs.push({ label: 'Доступ', path: '/access/log' })
  } else if (path.startsWith('/fulfillment')) {
    crumbs.push({ label: 'Выдача', path: '/fulfillment/rental' })
  }
  return crumbs
})

function handleMenuSelect(key) {
  if (routeMap[key]) {
    router.push(routeMap[key])
  }
}

// Keys that are NOT beta (ready sections)
const readyKeys = new Set([
  'events', 'events-list',
  'pricing',
  'sales', 'sales-orders', 'sales-tickets',
  'settings-venues',
  'crm', 'crm-guests', 'crm-segments',
])

function renderMenuLabel(option) {
  if (option.type === 'divider') return option.label
  if (readyKeys.has(option.key)) return option.label
  // Skip parent items that have at least one ready child
  if (option.children && option.children.some(c => readyKeys.has(c.key))) return option.label
  return h('span', { style: 'display: flex; align-items: center; gap: 8px' }, [
    option.label,
    h('span', {
      style: 'font-size: 9px; font-weight: 600; color: #8b5cf6; background: #ede9fe; padding: 1px 5px; border-radius: 4px; line-height: 14px; letter-spacing: 0.5px; text-transform: uppercase; flex-shrink: 0'
    }, 'beta')
  ])
}

const userMenuOptions = [
  { label: 'Профиль', key: 'profile', icon: renderIcon(PersonOutline) },
  { type: 'divider', key: 'd' },
  { label: 'Выйти', key: 'logout', icon: renderIcon(LogOutOutline) },
]

function handleUserMenu(key) {
  // stub
}
</script>

<style scoped>
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #efeff5;
  margin-bottom: 8px;
  cursor: pointer;
  transition: padding 0.3s;
}

.sidebar-logo--collapsed {
  padding: 16px 14px;
  justify-content: center;
}

.sidebar-logo__icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #1A56FF, #4070FF);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  color: #fff;
  flex-shrink: 0;
}

.sidebar-logo__text {
  font-weight: 700;
  font-size: 20px;
  color: #1a1a1a;
  white-space: nowrap;
}

.workspace-switcher {
  padding: 12px 16px;
  border-bottom: 1px solid #efeff5;
}

.workspace-switcher--collapsed {
  padding: 12px 10px;
}

.workspace-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.workspace-trigger:hover {
  background: #f5f5f7;
}

.venue-context {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f0f1f3;
}

.venue-context__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.venue-context__title {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.venue-context__count {
  font-size: 11px;
  color: #9ca3af;
}

.venue-context__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.venue-context__chip {
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
  transition: all 0.2s ease;
}

.venue-context__chip:hover {
  border-color: #bfd3ff;
  background: #eef4ff;
  color: #1d4ed8;
}

.venue-context__chip--active {
  border-color: #1a56ff;
  background: #1a56ff;
  color: #fff;
  box-shadow: 0 6px 16px rgba(26, 86, 255, 0.18);
}

.workspace-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  flex-shrink: 0;
}

.workspace-info {
  min-width: 0;
  flex: 1;
}

.workspace-name {
  font-weight: 600;
  font-size: 13px;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.workspace-plan {
  font-size: 11px;
  color: #999;
}
</style>
