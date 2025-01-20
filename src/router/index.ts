import { createWebHistory, createRouter } from 'vue-router';

import MainView from '@/views/MainView.vue';
import UserDetails from '@/views/UserDetails.vue';

const routes = [
	{ path: '/', component: MainView },
	{ path: '/users/:id', component: UserDetails },
	{ path: '/:pathPatch(.*)*', redirect: '/' },
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
