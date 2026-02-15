<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { formatDisplayDate } from '@/utils/date'
import { STATUS_LABELS, STATUS_ORDER } from '@/constants/tickets'

const route = useRoute()
const router = useRouter()
const ticketsStore = useTicketsStore()
const { error } = storeToRefs(ticketsStore)

const ticketData = ref(null)
const selectedStatus = ref('')
const isLoaded = ref(false)
const ticketId = computed(() => route.params.id)
const statusOptions = STATUS_ORDER

const isStatusChanged = computed(() => {
  if (!ticketData.value || !selectedStatus.value) return false
  return selectedStatus.value !== ticketData.value.status
})

onMounted(async () => {
  try {
    await ticketsStore.ensureTicketsLoaded()
    ticketData.value = ticketsStore.getTicketById(ticketId.value)
    selectedStatus.value = ticketData.value?.status ?? ''
  } finally {
    isLoaded.value = true
  }
})

const saveStatus = () => {
  if (!isStatusChanged.value) return
  ticketsStore.updateTicketStatus(selectedStatus.value, ticketId.value)
  ticketData.value = ticketsStore.getTicketById(ticketId.value)
  selectedStatus.value = ticketData.value?.status ?? ''
}

const goToTicketsList = () => {
  router.push({ name: 'tickets' })
}
</script>

<template>
  <div class="ticket-view">
    <div class="header-row">
      <button type="button" class="back-button" @click="goToTicketsList">
        Powrót do listy
      </button>
    </div>

    <div v-if="ticketData" class="ticket-card">
      <h2>Zgłoszenie #{{ ticketData.id }}</h2>

      <div class="info-grid">
        <div class="info-item">
          <span class="label">Imię i nazwisko klienta</span>
          <span class="value">{{ ticketData.customerName }}</span>
        </div>

        <div class="info-item">
          <span class="label">Temat</span>
          <span class="value">{{ ticketData.subject }}</span>
        </div>

        <div class="info-item">
          <span class="label">Priorytet</span>
          <span class="value value--caps">{{ ticketData.priority }}</span>
        </div>

        <div class="info-item">
          <span class="label">Data utworzenia</span>
          <span class="value">{{ formatDisplayDate(ticketData?.createdAt) }}</span>
        </div>

        <div class="info-item">
          <span class="label">Status</span>
          <div class="status-edit">
            <select v-model="selectedStatus">
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ STATUS_LABELS[status] || status }}
              </option>
            </select>
          </div>
        </div>

        <div class="info-item">
          <span class="label">Opis</span>
          <p class="description">{{ ticketData.description }}</p>
        </div>
      </div>

      <button type="button" class="save-button" :disabled="!isStatusChanged" @click="saveStatus">
        Zapisz
      </button>
    </div>

    <p v-else-if="error" class="loading">{{ error }}</p>
    <p v-else-if="isLoaded" class="loading">Nie znaleziono zgłoszenia.</p>
    <p v-else class="loading">Ładowanie zgłoszenia...</p>
  </div>
</template>
