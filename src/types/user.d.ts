import type { Types } from "mongoose"

export type IUser = {
  _id: Types.ObjectId
  id: string
  nombre: string
  apellido: string
  password: string
  email: string
  rol: string
  materias: MateriaUser[]
  carreras: Types.ObjectId[]
}

type MateriaUser = {
  materiaId: string
  estado: EstadoMateria
  anio?: number | null
  cuatrimestre?: number | null
  llamadosUsados?: number | null
  vencimiento?: {
    fecha?: number | null
    anio?: number | null
  } | null
  notaFinal?: number | null
  createdAt?: Date
  updatedAt?: Date
}

type EstadoMateria = "APROBADA" | "REGULARIZADA" | "CURSANDO" | "PROMOCIONADA"

// Inputs en mutation
export type RegisterUser = {
  nombre: string
  apellido: string
  password: string
  email: string
  carreraId?: Types.ObjectId
}

export type LoginUser = {
  email: string
  password: string
}

export type EstablecerEstadoMateria = {
  materiaId: string
  estado: EstadoMateria
  anio: number
  cuatrimestre: number
  nota?: number | null
}