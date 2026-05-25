import type { Types } from "mongoose"

export type IProfesor = {
  _id: Types.ObjectId
  id: string
  nombre: string
  nombreNormalizado: string
  email: string
  materias: string[]
}