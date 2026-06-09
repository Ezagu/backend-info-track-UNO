import { Schema, model } from 'mongoose'

const FechaImportanteSchema = new Schema({
  tipo: {
    type: String,
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  }
})

export const FechaImportante = model('FechaImportante', FechaImportanteSchema)