import Repository, { repository as RepositoryResource } from '../Repository'

const resource = '/api/room'
const repository = Repository(resource)

Object.assign(repository, {
  index (userId: any) {
    return RepositoryResource.get(`${resource}/${userId}`)
  },
  post (userId: any, payload: any) {
    return RepositoryResource.post(`${resource}/${userId}`, payload)
  },
  join (payload: any) {
    return RepositoryResource.post(`${resource}/join`, payload)
  }
})

export default repository
