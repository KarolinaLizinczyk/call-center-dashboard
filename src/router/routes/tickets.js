import Tickets from "@/views/Tickets/index.vue";
import Ticket from "@/views/Tickets/Ticket.vue";
import MainLayout from "@/layouts/MainLayout.vue";

export default [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'tickets',
                component: Tickets,
            },
            {
                path: 'ticket/:id',
                name: 'ticketsTicket',
                component: Ticket,
            }
        ]
    }
]
