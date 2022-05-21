import State from '@/store/index'
import * as MutationTypes from '@/store/mutationType'
import { Router } from 'vue-router'
import useToaster from '@/services/Toaster'

export default () => {
  const toaster = useToaster()

  const errorHandling = (error: any, store: typeof State, router: Router) => {
    console.log(error.config)

    if (error.response) {
      console.log(error.response.data)
      console.log({ status: error.response.status })
      console.log(error.response.headers)

      /** バリデーションエラーが発生した場合 */
      if (error.response.status === 422) {
        Object.keys(error.response.data.errors).map((key: any) => {
          toaster.showToaster(error.response.data.errors[key][0], 'error')
        })
      }

      /** csrf token が切れている時 */
      if (error.response.status === 419) {
        toaster.showToaster('ログインしなおしてください。', 'error')
        console.log(store)
        /** ユーザー情報の削除 */
        store.commit(MutationTypes.ADD_USER, {
          id: 0,
          name: '',
          email: ''
        })
        /** ログイン画面に遷移 */
        router.push('/login')
      }

      /** 500エラーが発生した場合 */
      if (error.response.status === 500) {
        toaster.showToaster('サーバーエラーが発生しました。', 'error')
      }
      return
    } else if (error.request) {
      console.log({ request: error.request })
    } else {
      console.log('Error', error.message)
    }
    /** 500エラーが発生した場合 */
    if (error.message === 'Network Error') {
      toaster.showToaster('サーバーエラーが発生しました。', 'error')
    }
  }

  return {
    errorHandling
  }
}
