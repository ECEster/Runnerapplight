import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, from, saved) => saved ?? (to.path === from.path ? undefined : { top: 0 }),
  routes: [
    { path: '/', component: HomeView, meta: { title: 'Hardlopen in Nederland' } },
    { path: '/agenda', component: () => import('./views/AgendaView.vue'), meta: { title: 'Agenda' } },
    { path: '/evenement/:id', component: () => import('./views/EventView.vue'), props: true, meta: { title: 'Evenement' } },
    { path: '/kids', component: () => import('./views/KidsView.vue'), meta: { title: 'Kids Runs' } },
    { path: '/trainingsschemas', component: () => import('./views/TrainingView.vue'), meta: { title: "Trainingsschema's" } },
    { path: '/fotos', component: () => import('./views/PhotosView.vue'), meta: { title: "Foto's" } },
    { path: '/mijnruns', component: () => import('./views/MyRunsView.vue'), meta: { title: 'Mijn Runs' } },
    { path: '/overons', component: () => import('./views/AboutView.vue'), meta: { title: 'Over ons' } },
    { path: '/contact', component: () => import('./views/ContactView.vue'), meta: { title: 'Contact' } },
    { path: '/admin', component: () => import('./views/AdminView.vue'), meta: { title: 'Admin' } },
    { path: '/:pathMatch(.*)*', component: () => import('./views/NotFoundView.vue'), meta: { title: 'Niet gevonden' } },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'RunningNederland'} — RunningNederland`
})
