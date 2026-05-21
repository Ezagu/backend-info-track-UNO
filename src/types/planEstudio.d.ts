import type { Types } from "mongoose"

export type IPlanEstudio = {
  carreraId: Types.ObjectId
  materiaId: string
  anio: number
  cuatrimestre: number
  correlativas: string[]
}