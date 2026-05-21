import type { Types } from "mongoose"

export type ICarrera = {
  _id: Types.ObjectId
  nombre: String
  duracion: Number
  descripcion: String
  tituloOtorgado: String
  cargaHorariaTotal: Number
}