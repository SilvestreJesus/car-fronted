import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Registro from '../components/Registro.vue'
import Parametros from '../components/Parametros.vue'
import Admin from '../components/Admin.vue'
import Control from '../components/Control.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/registro', component: Registro },
  // Añadimos meta: { requiresAuth: true } a las rutas privadas
  { 
    path: '/parametros', 
    component: Parametros, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/admin', 
    component: Admin, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/control', 
    component: Control, 
    meta: { requiresAuth: true } 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('userRole');

  // 1. Si la ruta es privada y NO hay token, mandarlo al Login
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/');
  } 
  // 2. Si intenta entrar a Admin pero no tiene el rol, mandarlo a Parámetros
  else if (to.path === '/admin' && role !== 'admin') {
    next('/parametros');
  }
  // 3. Si ya tiene sesión iniciada e intenta ir al Login o Registro, mandarlo a su panel
  else if ((to.path === '/' || to.path === '/registro') && token) {
    role === 'admin' ? next('/admin') : next('/parametros');
  }
  else {
    next();
  }
});

export default router;