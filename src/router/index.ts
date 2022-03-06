import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Meet from '../views/Meet.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import EmailVerify from '../views/EmailVerify.vue'
import SendEmail from '../views/SendEmail.vue'
import Logout from '../views/Logout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/meet',
    name: 'Meet',
    component: Meet,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/sign_up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/email_verify',
    name: 'EmailVerify',
    component: EmailVerify
  },
  {
    path: '/send_email',
    name: 'SendEmail',
    component: SendEmail
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
