import { createRouter, createWebHistory } from 'vue-router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import LoginPage from './components/LoginPage.vue';
import MainPage from './components/MainPage.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/main',
    name: 'Main',
    component: MainPage,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next('/');
  } else {
    next();
  }
});

export default router;