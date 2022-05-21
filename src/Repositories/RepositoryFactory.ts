import LoginRepository from './Auth/LoginRepository'
import UserRepository from './User/UserRepository'
import CsrfRepository from './User/CsrfRepository'
import RegisterRepository from './Auth/RegisterRepository'
import EmailVerifyRepository from './Auth/EmailVerifyRepository'
import LogoutRepository from './Auth/LogoutRepository'
import RoomRepository from './Room/RoomRepository'
import MemberRepository from './Member/MemberRepository'
import AdminLoginRepository from './Admin/LoginRepository'
import AdminRoomRepository from './Admin/RoomRepository'
import AdminUserRepository from './Admin/UserRepository'
import AdminLogoutRepository from './Admin/LogoutRepository'

interface repositoryObject {
  [name: string]: any
}

const repositories: repositoryObject = {
  login: LoginRepository,
  user: UserRepository,
  csrf: CsrfRepository,
  register: RegisterRepository,
  emailVerify: EmailVerifyRepository,
  logout: LogoutRepository,
  room: RoomRepository,
  member: MemberRepository,
  adminLogin: AdminLoginRepository,
  adminRoom: AdminRoomRepository,
  adminUser: AdminUserRepository,
  adminLogout: AdminLogoutRepository
}

export const RepositoryFactory = {
  get: (name: string) => repositories[name]
}
