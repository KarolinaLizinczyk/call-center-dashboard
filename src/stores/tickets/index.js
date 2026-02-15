import { defineStore } from 'pinia'
import { createTicketsState } from './state'
import { createTicketsActions } from './actions'
import { createTicketsGetters } from './getters'

export const useTicketsStore = defineStore('tickets', () => {
    const state = createTicketsState()
    const actions = createTicketsActions(state)
    const getters = createTicketsGetters(state)

    return {
        ...state,
        ...actions,
        ...getters
    }
})
