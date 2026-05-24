import type { Types } from "mongoose"

export type Puntuacion = {
  usuarioId: Types.ObjectId
  puntuacion: number
  fecha?: date
  comentario?: string
}

export type IProfesor = {
  nombre: string
  nombreNormalizado: string
  email: string
  puntuaciones: Puntuacion[]
  materias: string[]
}

export type PuntuarProfesorInput = {
  profesorId: Types.ObjectId
  puntuacion: number
  comentario?: string
}