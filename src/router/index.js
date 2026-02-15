import { createRouter, createWebHistory } from "vue-router";
import Tickets from "./routes/tickets.js";

const routes = [
    ...Tickets
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
