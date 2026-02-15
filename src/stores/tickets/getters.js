export const createTicketsGetters = (state) => {
    const filterTickets = (status) => {
        return state.tickets.value.filter((item) => item?.status === status)
    }

    return {
        filterTickets
    }
}