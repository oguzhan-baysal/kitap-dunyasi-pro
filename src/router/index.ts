import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue';
import { useStore } from 'vuex';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresGuest: true },
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
  const store = useStore();
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  // Update page title
  document.title = `${to.meta.title} - Kitap Dünyası Pro`;

  // Giriş gerektiren rotalar
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // Sadece giriş yapmamış kullanıcılar için rotalar
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
    return;
  }

  next();
});

export default router; 