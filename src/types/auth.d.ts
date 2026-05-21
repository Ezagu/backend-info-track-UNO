import type { IUser } from "./user.js"

export type Context = {
  currentUser: IUser | undefined
}

export type JwtPayload = {
  id: string
}