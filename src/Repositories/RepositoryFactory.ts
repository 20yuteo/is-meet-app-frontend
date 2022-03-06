import LoginRepository from './Auth/LoginRepository'
import UserRepository from './User/UserRepository'
import CsrfRepository from './User/CsrfRepository'
import RegisterRepository from './Auth/RegisterRepository'
import EmailVerifyRepository from './Auth/EmailVerifyRepository'
import LogoutRepository from './Auth/LogoutRepository'

interface repositoryObject {
  [name: string]: any
}

const repositories: repositoryObject = {
  login: LoginRepository,
  user: UserRepository,
  csrf: CsrfRepository,
  register: RegisterRepository,
  emailVerify: EmailVerifyRepository,
  logout: LogoutRepository
}

export const RepositoryFactory = {
  get: (name: string) => repositories[name]
}
