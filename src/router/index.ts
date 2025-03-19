import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: 'Ana Sayfa',
      },
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('@/views/Books.vue'),
      meta: {
        title: 'Kitaplar',
      },
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: () => import('@/views/BookDetail.vue'),
      meta: {
        title: 'Kitap Detayı',
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/Favorites.vue'),
      meta: {
        title: 'Favorilerim',
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        title: 'Profilim',
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPasswordView.vue'),
    },
    {
      path: '/book/add',
      name: 'book-add',
      component: () => import('@/views/BookAdd.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/book/:id/edit',
      name: 'book-edit',
      component: () => import('@/views/BookEdit.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: 'Sayfa Bulunamadı',
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  },
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = `${to.meta.title} - Kitap Dünyası Pro`;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/isAuthenticated']) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.meta.guest && store.getters['auth/isAuthenticated']) {
    next('/');
  } else {
    next();
  }
});

export default router; 