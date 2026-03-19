import { computed, reactive, ref, watch } from 'vue'

export const currentWorkspaceId = ref(1)
export const selectedVenueFilter = ref('all')

export const globalProductSettings = reactive({
  productName: 'Fanzilla',
  supportEmail: 'support@fanzilla.ru',
  timezone: 'Europe/Moscow',
  currency: 'RUB',
  bookingHoldMinutes: 15,
  loyaltyMode: 'shared',
  catalogMode: 'shared'
})

export const venueSettingsByWorkspace = reactive({
  1: {
    1: { contactEmail: 'ice-main@fanzilla.ru', timezone: 'Europe/Moscow', currency: 'RUB', ticketPrefix: 'ICE-MAIN', checkInOpensMinutes: 30 },
    2: { contactEmail: 'ice-training@fanzilla.ru', timezone: 'Europe/Moscow', currency: 'RUB', ticketPrefix: 'ICE-TRAIN', checkInOpensMinutes: 20 },
  },
  2: {
    1: { contactEmail: 'pool-big@fanzilla.ru', timezone: 'Europe/Moscow', currency: 'RUB', ticketPrefix: 'POOL-BIG', checkInOpensMinutes: 25 },
    2: { contactEmail: 'pool-open@fanzilla.ru', timezone: 'Europe/Moscow', currency: 'RUB', ticketPrefix: 'POOL-OPEN', checkInOpensMinutes: 25 },
    3: { contactEmail: 'pool-kids@fanzilla.ru', timezone: 'Europe/Moscow', currency: 'RUB', ticketPrefix: 'POOL-KIDS', checkInOpensMinutes: 15 },
  },
  3: {
    1: { contactEmail: 'arena-main@fanzilla.ru', timezone: 'Europe/Moscow', currency: 'RUB', ticketPrefix: 'ARENA-A', checkInOpensMinutes: 90 },
    2: { contactEmail: 'arena-small@fanzilla.ru', timezone: 'Europe/Moscow', currency: 'RUB', ticketPrefix: 'ARENA-B', checkInOpensMinutes: 45 },
  }
})

export const currentVenueSettings = computed(() => {
  if (selectedVenueFilter.value === 'all') return null
  return venueSettingsByWorkspace[currentWorkspaceId.value]?.[selectedVenueFilter.value] || null
})

watch(currentWorkspaceId, () => {
  selectedVenueFilter.value = 'all'
})
