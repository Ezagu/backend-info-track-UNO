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
  anio?: number
  cuatrimestre?: number
  llamadosUsados?: number | null
  vencimiento?: {
    fecha: number
    anio: number
  }
  notaFinal?: number | null
  createdAt: string
  updatedAt: string
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