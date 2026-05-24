import type { Types } from "mongoose"

type Rating = {
  usuarioId: Types.ObjectId
  rate: number
  fecha: date
  comentario?: string
}

export type IProfesor = {
  nombre: string
  nombreNormalizado: string
  email: string
  ratings: Rating[]
  materias: string[]
}