import Repository, { repository as RepositoryResource } from '../Repository'

const resource = 'admin/room'
const repository = Repository(resource)

Object.assign(repository, {
  index (page: number) {
    return RepositoryResource.get(`${resource}?page=${page}`)
  }
})

export default repository
