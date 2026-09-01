import { defineRouter } from '#q-app';
import { useAuthStore } from '@/stores/auth.store';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

export default defineRouter(({ store }) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore(store);

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      };
    }

    if (to.path === '/login' && authStore.isAuthenticated) {
      return '/';
    }

    return true;
  });

  if (import.meta.hot) {
    import.meta.hot.accept('./routes', () => {
      // Hot reload routes if needed
    });
  }

  return Router;
});
