import axios from 'axios'

const baseDomain = process.env.VUE_APP_BASE_URL
const baseURL = `${baseDomain}`

export const repository = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'X-Requested-With': 'XMLHttpRequest'
  }
})

export default (resource: string) => {
  return {
    index () {
      return repository.get(resource)
    },
    get (payload: any) {
      return repository.get(`${resource}`, {
        params: {
          ...payload
        }
      })
    },
    show (id: number) {
      return repository.get(`${resource}/${id}`)
    },
    post (payload: any) {
      return repository.post(resource, payload)
    },
    put (payload: any) {
      return repository.put(`${resource}/${payload.id}`, payload)
    },
    delete (id: number) {
      return repository.delete(`${resource}/${id}`)
    }
  }
}
