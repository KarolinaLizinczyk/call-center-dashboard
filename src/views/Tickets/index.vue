<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { STATUS_LABELS, STATUS_ORDER } from '@/constants/tickets'

const router = useRouter()
const ticketsStore = useTicketsStore()
const { tickets, error } = storeToRefs(ticketsStore)

const selectedStatus = ref('')
const isLoading = ref(true)

onMounted(async () => {
    try {
        isLoading.value = true
        await ticketsStore.ensureTicketsLoaded()
    } finally {
        isLoading.value = false
    }
})

const statuses = computed(() => {
    return STATUS_ORDER.filter((status) =>
        tickets.value.some((ticket) => ticket.status === status)
    )
})

const filteredTickets = computed(() => {
    if (!selectedStatus.value) return tickets.value
    return ticketsStore.filterTickets(selectedStatus.value)
})

function openTicket(ticketId) {
    router.push({ name: 'ticketsTicket', params: { id: ticketId } })
}
</script>


<template>
<div class="tickets-view">
    <div class="filters">
        <h6>Status:</h6>
        <label class="form-control">
            <select v-model="selectedStatus">
                <option value="">Wszystkie</option>
                <option v-for="status in statuses" :key="status" :value="status">{{ STATUS_LABELS[status] || status }}</option>
            </select>
        </label>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Imię i nazwisko klienta</th>
                <th>Temat</th>
                <th>Status</th>
                <th>Priorytet</th>
            </tr>
        </thead>
        <tbody v-if="isLoading">
            <tr>
                <td class="table-loader" colspan="5">Ładowanie zgłoszeń...</td>
            </tr>
        </tbody>
        <tbody v-else-if="error && !filteredTickets.length">
            <tr>
                <td class="table-error" colspan="5">{{ error }}</td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="ticket in filteredTickets"
                :key="ticket.id"
                @click="openTicket(ticket.id)"
            >
                <td data-label="ID">{{ ticket.id }}</td>
                <td data-label="Imię i nazwisko klienta">{{ ticket.customerName }}</td>
                <td data-label="Temat">{{ ticket.subject }}</td>
                <td data-label="Status">
                    <span class="status-badge" :class="`status-badge--${ticket.status}`">
                        {{ STATUS_LABELS[ticket.status] || ticket.status }}
                    </span>
                </td>
                <td data-label="Priorytet">{{ ticket.priority }}</td>
            </tr>
        </tbody>
    </table>
</div>

</template>
