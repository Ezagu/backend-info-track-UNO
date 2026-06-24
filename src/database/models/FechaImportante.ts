import { Schema, model } from 'mongoose'

const FechaImportanteSchema = new Schema({
  titulo: {
    type: String,
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: Date,
  descripcion: {
    type: String,
    required: true
  }
})

export const FechaImportante = model('FechaImportante', FechaImportanteSchema)