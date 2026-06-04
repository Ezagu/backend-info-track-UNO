import type { Types } from "mongoose"

export type IUser = {
  id: Types.ObjectId
  nombre: string
  apellido: string
  password: string
  email: string
  rol: string
  materias: MateriaUser[]
  carreras: string[]
}

type MateriaUser = {
  materiaId: string
  estado: EstadoMateria
  anio: number
  cuatrimestre: number
  llamadosUsados?: number | null
  vencimiento?: Date | null
  notaFinal?: number | null
}

export enum EstadoMateria {
  APROBADA = "APROBADA",
  REGULARIZADA = "REGULARIZADA",
  CURSANDO = "CURSANDO",
  PROMOCIONADA = "PROMOCIONADA"
}

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