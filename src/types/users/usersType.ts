import { getDecodedTokenFromStorage } from '../../utils/token'

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
}
export type Role = keyof typeof ROLES

export type DecodedUser = {
  email: string
  exp: number
  iat: number
  role: Role
  userID: string
  firstName: string
  lastName: string
}

export type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  isActive: boolean | null
}

export type UsersinitialState = {
  users: User[]
  isLogedIn: boolean
  isLogedOut: boolean
  error: null | string
  isLoading: boolean
  decodedUser: DecodedUser | null | any
  loggedUser: null | User
  userRole: null | Role
  isEditForm: boolean
  popUp: boolean
  message: string | null | object
}

export type tokenUser = {
  email: string
  userID: number
  role: string
}

export type UserInfo = Partial<User>
