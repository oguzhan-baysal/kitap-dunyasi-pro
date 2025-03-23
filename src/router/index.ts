import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import ForgotPasswordView from '@/views/auth/ForgotPasswordView.vue';
import BookDetail from '@/views/BookDetail.vue';
import BookManage from '@/views/BookManage.vue';
import store from '@/store';

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
      path: '/books/:id',
      name: 'book-detail',
      component: BookDetail,
      props: true,
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
      meta: {
        title: 'Giriş Yap',
        requiresGuest: true,
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Kayıt Ol',
        requiresGuest: true,
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { requiresGuest: true },
    },
    {
      path: '/books/add',
      name: 'book-add',
      component: () => import('@/views/AddBook.vue'),
      meta: {
        title: 'Yeni Kitap Ekle',
        requiresAuth: true,
      },
    },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: BookManage,
      meta: {
        title: 'Kitap Düzenle',
        requiresAuth: true,
      },
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
  const isAuthenticated = store.getters['auth/isAuthenticated'];

  // Update page title
  document.title = `${to.meta.title} | Kitap Dünyası` || 'Kitap Dünyası';

  // Giriş gerektiren rotalar
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
    return;
  }

  // Sadece giriş yapmamış kullanıcılar için rotalar
  if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' });
    return;
  }

  next();
});

// Sayfa geçişlerinde scroll pozisyonunu sıfırla
router.afterEach((to, from) => {
  window.scrollTo(0, 0);
});

export default router; 