import type { Types } from "mongoose"

export type ICarrera = {
  _id: Types.ObjectId
  id: string
  nombre: String
  duracion: Number
  descripcion: String
  tituloOtorgado: String
  cargaHorariaTotal: Number
}