import { State } from '@/store/index'
import { Store } from 'vuex'

export default ({ store, to, from, next }: {
  store: Store<State>,
  to: any,
  from: any,
  next: any
}) => {
  if (!store.getters.isLogin) {
    // next('/login')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return false
  }
  next()
}
