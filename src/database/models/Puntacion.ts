import { Schema, model } from "mongoose";

const PuntuacionSchema = new Schema({
  usuarioId: {
      type: Schema.ObjectId,
      ref: 'Usuario'
  },
  profesorId: {
    type: Schema.ObjectId,
    ref: 'Profesor'
  },
  puntuacion: {
      type: Number,
      required: true,
      min: 0,
      max: 5
  },
  comentario: String,
  fecha: {
      type: Date,
      default: Date.now
  }
})

export const Puntuacion = model('Puntuacion', PuntuacionSchema, 'puntuaciones')