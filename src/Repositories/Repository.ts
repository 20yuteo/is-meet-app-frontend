import axios from 'axios'

const baseDomain = 'http://localhost'
const baseURL = `${baseDomain}`

export const repository = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
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
