
export const createTicketsActions = (state) => {
    const simulateApiDelay = (ms = 700) =>
        new Promise((resolve) => {
            setTimeout(resolve, ms)
        })

    const fetchTickets = async () => {
        state.error.value = ''

        try {
            await simulateApiDelay()
            const response = await fetch('/tickets.json')

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()
            state.tickets.value = Array.isArray(data) ? data : []
            return state.tickets.value
        } catch (error) {
            state.error.value = 'Nie udało się pobrać zgłoszeń.'
            throw error
        }
    }

    const ensureTicketsLoaded = async () => {
        if (state.tickets.value.length === 0) {
            await fetchTickets()
        }
    }

    const getTicketById = (id) => {
        if (!id) return null
        return state.tickets.value.find((item) => String(item?.id) === String(id)) ?? null
    }

    const updateTicketStatus = (status, id) => {
        let ticket = state.tickets.value.find((item) => String(item?.id) === String(id))
        if (!ticket) return
        ticket.status = status
    }

    return {
        fetchTickets,
        ensureTicketsLoaded,
        getTicketById,
        updateTicketStatus
    }
}
