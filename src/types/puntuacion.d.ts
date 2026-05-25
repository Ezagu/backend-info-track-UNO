import type { Types } from "mongoose"

export type IPuntuacion = {
  usuarioId: Types.ObjectId
  profesorId: Types.ObjectId
  puntuacion: number
  comentario?: string
  fecha?: date
}

export type PuntuarProfesorInput = {
  profesorId: Types.ObjectId
  puntuacion: number
  comentario?: string
}

export type ModificarPuntuacionInput = {
  puntuacionId: Types.ObjectId
  puntuacion?: number
  comentario?: string
}