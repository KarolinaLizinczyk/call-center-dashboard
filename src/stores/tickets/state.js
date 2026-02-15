import { ref } from 'vue'


export function createTicketsState() {
    return {
        tickets: ref([]),
        error: ref(''),
    }
}
