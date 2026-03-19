import { ref, watch } from 'vue'

export const currentWorkspaceId = ref(1)
export const selectedVenueFilter = ref('all')

watch(currentWorkspaceId, () => {
  selectedVenueFilter.value = 'all'
})
