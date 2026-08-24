import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/pages/index.vue'),
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            component: () => import('@/pages/products/index.vue'),
          },
        ],
      },
      {
        path: 'stock',
        children: [
          {
            path: 'alerts',
            component: () => import('@/pages/stock/alerts.vue'),
          },
          {
            path: 'movements',
            component: () => import('@/pages/stock/movements.vue'),
          },
        ],
      },
      {
        path: 'purchase-orders',
        children: [
          {
            path: '',
            component: () => import('@/pages/purchase-orders/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/pages/login.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/[...path].vue'),
  },
];

export default routes;
