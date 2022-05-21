import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Room from '../views/Room.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import EmailVerify from '../views/EmailVerify.vue'
import SendEmail from '../views/SendEmail.vue'
import Logout from '../views/Logout.vue'
import Profile from '../views/Profile.vue'
import Meets from '../views/Meets.vue'
import authentication from '../middleware/authentication'
import adminAuthentication from '@/middleware/adminAuthentication'
import Video from '@/views/Video.vue'
import Call from '@/views/Call.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import RoomDetail from '@/views/admin/RoomDetail.vue'
import UserDetail from '@/views/admin/UserDetail.vue'
import RoomIndex from '@/views/admin/RoomIndex.vue'
import UserIndex from '@/views/admin/UserIndex.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'

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
    path: '/room',
    name: 'Room',
    component: Room
  },
  {
    path: '/call',
    name: 'Call',
    component: Call
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
    component: EmailVerify,
    meta: {
      middleware: [authentication]
    }
  },
  {
    path: '/send_email',
    name: 'SendEmail',
    component: SendEmail,
    meta: {
      middleware: [authentication]
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {
      middleware: [authentication]
    }
  },
  {
    path: '/meets',
    name: 'Meets',
    component: Meets,
    meta: {
      middleware: [authentication]
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      middleware: [authentication]
    }
  },
  {
    path: '/video',
    name: 'Video',
    component: Video,
    meta: {
      middleware: [authentication]
    }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import(/* webpackChunkName: "about" */ '@/views/admin/Login.vue')
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: {
      middleware: [adminAuthentication]
    }
  },
  {
    path: '/admin/room/:id',
    name: 'AdminRoomDetail',
    component: RoomDetail,
    meta: {
      middleware: [adminAuthentication]
    }
  },
  {
    path: '/admin/user/:id',
    name: 'AdminUserDetail',
    component: UserDetail,
    meta: {
      middleware: [adminAuthentication]
    }
  },
  {
    path: '/admin/room',
    name: 'AdminRoomIndex',
    component: RoomIndex,
    meta: {
      middleware: [adminAuthentication]
    }
  },
  {
    path: '/admin/user',
    name: 'AdminUserIndex',
    component: UserIndex,
    meta: {
      middleware: [adminAuthentication]
    }
  },
  {
    path: '/privacy_policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
